import { NextResponse } from "next/server";
import { verifyWebhook, sendInstagramDirectMessage, sendMessengerMessage } from "@/services/metaApi";
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase/config";
import { logAutoDM } from "@/firebase/db";

// GET handler for Webhook verification from Meta
export async function GET(request) {
  try {
    const result = verifyWebhook(request);
    if (result.status === 200) {
      return new NextResponse(result.challenge.toString(), { status: 200 });
    }
    return NextResponse.json({ error: result.error }, { status: result.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler for receiving real-time webhook events
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Inbound Meta Webhook Event received:", JSON.stringify(body, null, 2));

    // Check if the event is a page subscription (Messenger or IG DM)
    if (body.object === "page" || body.object === "instagram") {
      const entries = body.entry || [];

      for (const entry of entries) {
        // Facebook Page ID or Instagram Account ID
        const accountId = entry.id; 
        
        // Loop through messaging events
        const messagingEvents = entry.messaging || [];
        for (const event of messagingEvents) {
          const senderId = event.sender?.id;
          const recipientId = event.recipient?.id;
          const messageText = event.message?.text;

          // Skip if no message text, or if this is a reply sent by the page itself
          if (!messageText || event.message.is_echo) continue;

          console.log(`Processing message from ${senderId}: "${messageText}" on account: ${accountId}`);

          // Trigger Keyword Check & Auto DM Logic
          await processInboundMessage({
            platform: body.object === "instagram" ? "instagram" : "facebook",
            accountId,
            senderId,
            messageText
          });
        }
      }

      return NextResponse.json({ status: "success" }, { status: 200 });
    }

    return NextResponse.json({ error: "Unsupported object type" }, { status: 400 });
  } catch (error) {
    console.error("Webhook execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Core keyword-matcher and automatic DM replier logic.
 */
async function processInboundMessage({ platform, accountId, senderId, messageText }) {
  try {
    // 1. Fetch the connected account details from Firestore to verify connection and retrieve Page Access Token
    const accountsRef = collection(db, "connected_accounts");
    const accountQuery = query(
      accountsRef, 
      where("pageId", "==", accountId),
      where("platform", "==", platform),
      where("status", "==", "connected")
    );
    const accountSnapshot = await getDocs(accountQuery);
    
    if (accountSnapshot.empty) {
      console.warn(`No active connected account found in DB for ID: ${accountId} on platform ${platform}`);
      return;
    }

    const accountDoc = accountSnapshot.docs[0];
    const accountData = accountDoc.data();
    const userId = accountData.userId;
    const pageAccessToken = accountData.pageAccessToken; // Needed to reply

    if (!pageAccessToken) {
      console.warn(`No access token saved for connected account: ${accountId}`);
      return;
    }

    // 2. Fetch the user's active automations for the corresponding platform
    const automationsRef = collection(db, "automations");
    const automationsQuery = query(
      automationsRef,
      where("userId", "==", userId),
      where("platform", "==", platform),
      where("isActive", "==", true)
    );
    const automationsSnapshot = await getDocs(automationsQuery);

    if (automationsSnapshot.empty) {
      console.log(`No active automations found for user ${userId} on ${platform}`);
      return;
    }

    // 3. Look for keyword match
    let matchedAutomation = null;
    let matchedKeyword = "";
    const lowerMessage = messageText.toLowerCase();

    for (const doc of automationsSnapshot.docs) {
      const autoData = doc.data();
      const keywords = autoData.keywords || [];
      
      // Match keywords in string
      const matched = keywords.find(kw => lowerMessage.includes(kw.toLowerCase()));
      if (matched) {
        matchedAutomation = { id: doc.id, ...autoData };
        matchedKeyword = matched;
        break; // Match found, stop looking
      }
    }

    if (!matchedAutomation) {
      console.log("No keyword matches found in current message.");
      return;
    }

    // 4. Send Automatic Reply using Meta Graph API
    console.log(`Keyword matched! Auto-replying with: "${matchedAutomation.replyText}"`);
    let apiResult;
    
    if (platform === "instagram") {
      apiResult = await sendInstagramDirectMessage(
        accountId, // Instagram Business Account ID
        senderId,  // Inbound sender ID
        matchedAutomation.replyText,
        pageAccessToken
      );
    } else {
      apiResult = await sendMessengerMessage(
        accountId, // Facebook Page ID
        senderId,  // Inbound sender ID
        matchedAutomation.replyText,
        pageAccessToken
      );
    }

    // 5. Log the DM auto-reply interaction in our Firestore logs database & increment trigger count
    if (apiResult.success) {
      await logAutoDM(userId, {
        platform,
        senderName: senderId, // Fallback since retrieving full name requires additional permission scopes
        senderPic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderId}`,
        receivedMessage: messageText,
        triggeredKeyword: matchedKeyword,
        sentReply: matchedAutomation.replyText
      });

      // Increment times triggered
      const autoRef = doc(db, "automations", matchedAutomation.id);
      await updateDoc(autoRef, {
        timesTriggered: increment(1)
      });
      
      console.log(`Auto reply logged and trigger counter incremented for automation ${matchedAutomation.id}`);
    } else {
      console.error("Failed to send message via Meta Graph API:", apiResult.error);
    }

  } catch (error) {
    console.error("Error processing inbound message auto-reply:", error);
  }
}
