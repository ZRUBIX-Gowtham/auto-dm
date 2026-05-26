/**
 * Meta API Service (Instagram Graph API & Facebook Messenger API Integration)
 * 
 * This service manages:
 * 1. Meta OAuth connection flows
 * 2. Fetching user's Pages & connected Instagram Business accounts
 * 3. Sending replies via Instagram Direct Messages and Facebook Messenger
 * 4. Verification and handling of Webhook events
 */

const META_API_VERSION = "v19.0";
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

/**
 * Returns the OAuth URL to redirect the user to for connecting Meta Accounts.
 * Scopes required:
 * - pages_show_list: To list user's pages
 * - pages_messaging: To send/receive messages on Messenger
 * - instagram_basic: To read Instagram profile details
 * - instagram_manage_messages: To send/receive messages on Instagram
 * - pages_read_engagement: Required by Messenger API
 */
export const getMetaOAuthUrl = (userId) => {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID || "YOUR_META_APP_ID";
  const redirectUri = typeof window !== "undefined"
    ? `${window.location.origin}/api/oauth/callback`
    : "http://localhost:3000/api/oauth/callback";
  
  const scopes = [
    "pages_show_list",
    "pages_messaging",
    "instagram_basic",
    "instagram_manage_messages",
    "pages_read_engagement"
  ].join(",");

  const state = userId ? encodeURIComponent(userId) : "";
  const stateParam = state ? `&state=${state}` : "";

  return `https://www.facebook.com/${META_API_VERSION}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=code${stateParam}`;
};

/**
 * Exchange Meta OAuth code for User Access Token.
 */
export const exchangeOAuthCodeForToken = async (code) => {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/oauth/callback`;

  const url = `${META_BASE_URL}/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to exchange OAuth code for token");
  }

  return response.json(); // returns { access_token, token_type, expires_in }
};

/**
 * Fetch Facebook Pages connected to the authenticated user.
 */
export const fetchUserFacebookPages = async (userAccessToken) => {
  const url = `${META_BASE_URL}/me/accounts?fields=id,name,username,access_token,picture{url}&access_token=${userAccessToken}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to fetch Facebook pages");
  }

  const result = await response.json();
  return result.data; // Array of pages
};

/**
 * Fetch Instagram Business Account linked to a Facebook Page.
 */
export const fetchInstagramBusinessAccount = async (pageId, pageAccessToken) => {
  const url = `${META_BASE_URL}/${pageId}?fields=instagram_business_account{id,username,name,profile_picture_url}&access_token=${pageAccessToken}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to fetch Instagram account");
  }

  const result = await response.json();
  return result.instagram_business_account || null;
};

/**
 * Subscribe a Facebook Page to Webhooks for receiving messages.
 */
export const subscribePageToWebhooks = async (pageId, pageAccessToken) => {
  const url = `${META_BASE_URL}/${pageId}/subscribed_apps?subscribed_fields=messages,messaging_postbacks,message_reactions&access_token=${pageAccessToken}`;
  
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to subscribe Page to webhooks");
  }

  const result = await response.json();
  return result.success; // true/false
};

/**
 * Send an Automatic Reply Message on Facebook Messenger.
 */
export const sendMessengerMessage = async (pageId, recipientId, text, pageAccessToken) => {
  const url = `${META_BASE_URL}/${pageId}/messages?access_token=${pageAccessToken}`;
  
  const payload = {
    recipient: { id: recipientId },
    message: { text: text },
    messaging_type: "RESPONSE" // Crucial for Meta policy compliance
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error sending Facebook Messenger Message:", error);
    return { success: false, error: error.error?.message };
  }

  return { success: true, data: await response.json() };
};

/**
 * Send an Automatic Reply Message on Instagram Direct Message.
 */
export const sendInstagramDirectMessage = async (instagramAccountId, recipientId, text, pageAccessToken) => {
  // Instagram uses the connected Facebook Page access token for authentication
  const url = `${META_BASE_URL}/${instagramAccountId}/messages?access_token=${pageAccessToken}`;

  const payload = {
    recipient: { id: recipientId },
    message: { text: text },
    recipient_type: "instagram"
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error sending Instagram Direct Message:", error);
    return { success: false, error: error.error?.message };
  }

  return { success: true, data: await response.json() };
};

/**
 * Webhook Verification Handler (GET request challenge from Meta)
 */
export const verifyWebhook = (req) => {
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;
  
  const urlParams = new URL(req.url).searchParams;
  const mode = urlParams.get("hub.mode");
  const token = urlParams.get("hub.verify_token");
  const challenge = urlParams.get("hub.challenge");

  if (mode === "subscribe" && token === verifyToken) {
    console.log("Webhook verified successfully by Meta.");
    return { status: 200, challenge: parseInt(challenge, 10) };
  } else {
    console.warn("Webhook verification failed. Verify tokens mismatch.");
    return { status: 403, error: "Verification token mismatch" };
  }
};
