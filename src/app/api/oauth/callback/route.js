import { NextResponse } from "next/server";
import { exchangeOAuthCodeForToken, fetchUserFacebookPages, fetchInstagramBusinessAccount, subscribePageToWebhooks } from "@/services/metaApi";
import { addConnectedAccount } from "@/firebase/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state") || "demo_user";
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    // Redirect Base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (error) {
      console.error("Meta OAuth login error:", errorDescription);
      return NextResponse.redirect(`${baseUrl}/connected-accounts?status=error&message=${encodeURIComponent(errorDescription || "OAuth failed")}`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/connected-accounts?status=error&message=Missing OAuth Authorization Code`);
    }

    // In local demo or testing mode without Meta App Secrets set up,
    // we can redirect directly with simulated success.
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (!appId || !appSecret || appId === "YOUR_META_APP_ID") {
      console.log("Meta App Credentials missing. Redirecting with simulated OAuth connection.");
      return NextResponse.redirect(`${baseUrl}/connected-accounts?status=simulated_success`);
    }

    // 1. Exchange OAuth code for User Access Token
    const tokenData = await exchangeOAuthCodeForToken(code);
    const userAccessToken = tokenData.access_token;

    // 2. Retrieve all Facebook Pages connected to user's Meta Account
    const fbPages = await fetchUserFacebookPages(userAccessToken);
    
    let connectedCount = 0;

    for (const page of fbPages) {
      // 3. Check if Page has a connected Instagram Business Account
      const igAccount = await fetchInstagramBusinessAccount(page.id, page.access_token);
      
      // 4. Subscribe the Page to Webhook events (realtime message listener)
      await subscribePageToWebhooks(page.id, page.access_token);

      // 5. Save/Update Page in connected accounts Firestore database
      await addConnectedAccount(state, {
        platform: "facebook",
        username: page.username || page.name.toLowerCase().replace(/\s+/g, ""),
        displayName: page.name,
        profilePicture: page.picture?.data?.url || `https://api.dicebear.com/7.x/identicon/svg?seed=${page.id}`,
        pageId: page.id,
        pageAccessToken: page.access_token
      });

      connectedCount++;

      // If Instagram Business Account is present, link and save it
      if (igAccount) {
        await addConnectedAccount(state, {
          platform: "instagram",
          username: igAccount.username,
          displayName: igAccount.name || igAccount.username,
          profilePicture: igAccount.profile_picture_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${igAccount.id}`,
          pageId: igAccount.id, // Instagram Business Account ID
          pageAccessToken: page.access_token // Uses parent Page Access Token for graph requests
        });
        connectedCount++;
      }
    }

    return NextResponse.redirect(`${baseUrl}/connected-accounts?status=success&connected=${connectedCount}`);

  } catch (error) {
    console.error("Meta OAuth Callback Error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/connected-accounts?status=error&message=${encodeURIComponent(error.message)}`);
  }
}
