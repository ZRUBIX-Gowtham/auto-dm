import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { db, isSimulationMode } from "./config";

// --- MOCK DATABASE STORE (LOCAL STORAGE) ---
const MOCK_DB = {
  automations: "insta_auto_dm_db_automations",
  connected_accounts: "insta_auto_dm_db_accounts",
  messages: "insta_auto_dm_db_messages",
};

const getLocalStorageData = (key, defaultVal = []) => {
  if (typeof window === "undefined") return defaultVal;
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaultVal;
};

const saveLocalStorageData = (key, data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Seed initial mock data if empty
const seedMockDatabase = () => {
  if (typeof window === "undefined") return;

  const mockAutomations = getLocalStorageData(MOCK_DB.automations, null);
  if (mockAutomations === null) {
    const initialAutomations = [
      {
        id: "auto_1",
        userId: "demo_user",
        name: "Product Price Inquiry",
        platform: "instagram",
        keywords: ["price", "cost", "how much", "rate"],
        replyText: "Thanks for messaging us! Our starter plan is $19/mo, and our professional plan is $49/mo. You can view all pricing details here: https://example.com/pricing ✅",
        isActive: true,
        timesTriggered: 142,
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: "auto_2",
        userId: "demo_user",
        name: "Welcome Greetings",
        platform: "facebook",
        keywords: ["hello", "hi", "hey", "start"],
        replyText: "Hello there! 👋 Welcome to our support. How can we assist you today? Please type 'price' or 'demo' for instant options.",
        isActive: true,
        timesTriggered: 389,
        createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: "auto_3",
        userId: "demo_user",
        name: "Demo Booking",
        platform: "instagram",
        keywords: ["demo", "book", "call"],
        replyText: "Awesome! You can book a live 1-on-1 demo with our product specialist here: https://calendly.com/example/demo 📅. Looking forward to chatting!",
        isActive: false,
        timesTriggered: 24,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      }
    ];
    saveLocalStorageData(MOCK_DB.automations, initialAutomations);
  }

  const mockAccounts = getLocalStorageData(MOCK_DB.connected_accounts, null);
  if (mockAccounts === null) {
    const initialAccounts = [
      {
        id: "acc_1",
        userId: "demo_user",
        platform: "instagram",
        username: "creative.brand",
        displayName: "Creative Brand Studio",
        profilePicture: "https://api.dicebear.com/7.x/identicon/svg?seed=creative.brand",
        status: "connected",
        connectedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        pageId: "10932849204823"
      },
      {
        id: "acc_2",
        userId: "demo_user",
        platform: "facebook",
        username: "creativebrandfb",
        displayName: "Creative Brand Facebook Page",
        profilePicture: "https://api.dicebear.com/7.x/identicon/svg?seed=creativebrandfb",
        status: "connected",
        connectedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        pageId: "582384729384"
      }
    ];
    saveLocalStorageData(MOCK_DB.connected_accounts, initialAccounts);
  }

  const mockMessages = getLocalStorageData(MOCK_DB.messages, null);
  if (mockMessages === null) {
    const initialMessages = [
      {
        id: "msg_1",
        userId: "demo_user",
        platform: "instagram",
        senderName: "alex_jones",
        senderPic: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        receivedMessage: "Hi, how much is the subscription?",
        triggeredKeyword: "how much",
        sentReply: "Thanks for messaging us! Our starter plan is $19/mo, and our professional plan is $49/mo. You can view all pricing details here: https://example.com/pricing ✅",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago
      },
      {
        id: "msg_2",
        userId: "demo_user",
        platform: "facebook",
        senderName: "Sarah Miller",
        senderPic: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        receivedMessage: "hello support! I would like to ask a question",
        triggeredKeyword: "hello",
        sentReply: "Hello there! 👋 Welcome to our support. How can we assist you today? Please type 'price' or 'demo' for instant options.",
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString() // 2 hours ago
      },
      {
        id: "msg_3",
        userId: "demo_user",
        platform: "instagram",
        senderName: "lifestyle_guru",
        senderPic: "https://api.dicebear.com/7.x/avataaars/svg?seed=guru",
        receivedMessage: "How can I book a call with your team?",
        triggeredKeyword: "book",
        sentReply: "Awesome! You can book a live 1-on-1 demo with our product specialist here: https://calendly.com/example/demo 📅. Looking forward to chatting!",
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString() // 5 hours ago
      },
      {
        id: "msg_4",
        userId: "demo_user",
        platform: "instagram",
        senderName: "charlie_brown",
        senderPic: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
        receivedMessage: "rate details please?",
        triggeredKeyword: "rate",
        sentReply: "Thanks for messaging us! Our starter plan is $19/mo, and our professional plan is $49/mo. You can view all pricing details here: https://example.com/pricing ✅",
        timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString() // 1 day ago
      }
    ];
    saveLocalStorageData(MOCK_DB.messages, initialMessages);
  }
};

// Execute seeding
seedMockDatabase();

// Observers system for simulating live database streaming
const dbObservers = {
  automations: new Set(),
  connected_accounts: new Set(),
  messages: new Set(),
};

const notifyObservers = (collectionName) => {
  dbObservers[collectionName].forEach(observer => {
    const filteredData = observer.filterFn(getLocalStorageData(MOCK_DB[collectionName]));
    observer.callback(filteredData);
  });
};

// --- DATABASE FUNCTIONS ---

// 1. Automations CRUD
export const addAutomation = async (userId, automationData) => {
  if (isSimulationMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const automations = getLocalStorageData(MOCK_DB.automations);
        const newAuto = {
          id: "auto_" + Math.random().toString(36).substr(2, 9),
          userId,
          timesTriggered: 0,
          createdAt: new Date().toISOString(),
          ...automationData,
        };
        automations.unshift(newAuto);
        saveLocalStorageData(MOCK_DB.automations, automations);
        notifyObservers("automations");
        resolve(newAuto.id);
      }, 500);
    });
  }

  // Real Firestore
  const docRef = await addDoc(collection(db, "automations"), {
    userId,
    timesTriggered: 0,
    createdAt: serverTimestamp(),
    ...automationData,
  });
  return docRef.id;
};

export const updateAutomation = async (automationId, automationData) => {
  if (isSimulationMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const automations = getLocalStorageData(MOCK_DB.automations);
        const index = automations.findIndex(a => a.id === automationId);
        if (index !== -1) {
          automations[index] = { ...automations[index], ...automationData };
          saveLocalStorageData(MOCK_DB.automations, automations);
          notifyObservers("automations");
        }
        resolve();
      }, 400);
    });
  }

  // Real Firestore
  const docRef = doc(db, "automations", automationId);
  return updateDoc(docRef, automationData);
};

export const deleteAutomation = async (automationId) => {
  if (isSimulationMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const automations = getLocalStorageData(MOCK_DB.automations);
        const filtered = automations.filter(a => a.id !== automationId);
        saveLocalStorageData(MOCK_DB.automations, filtered);
        notifyObservers("automations");
        resolve();
      }, 400);
    });
  }

  // Real Firestore
  const docRef = doc(db, "automations", automationId);
  return deleteDoc(docRef);
};

export const subscribeToAutomations = (userId, callback) => {
  // If simulation mode, setup a mock subscription
  if (isSimulationMode) {
    const filterFn = (list) => list.filter(item => item.userId === userId || userId === "demo_user");
    const observer = { callback, filterFn };
    dbObservers.automations.add(observer);

    // Immediate callback execution with cached data
    callback(filterFn(getLocalStorageData(MOCK_DB.automations)));

    // Return unsubscribe function
    return () => {
      dbObservers.automations.delete(observer);
    };
  }

  // Real Firestore
  const q = query(
    collection(db, "automations"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const list = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    callback(list);
  }, (err) => {
    console.error("Firestore subscription error: ", err);
  });
};

// 2. Connected Accounts CRUD
export const addConnectedAccount = async (userId, accountData) => {
  if (isSimulationMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const accounts = getLocalStorageData(MOCK_DB.connected_accounts);
        // Remove if duplicate pageId exists
        const filtered = accounts.filter(a => a.pageId !== accountData.pageId);
        const newAcc = {
          id: "acc_" + Math.random().toString(36).substr(2, 9),
          userId,
          connectedAt: new Date().toISOString(),
          status: "connected",
          ...accountData
        };
        filtered.push(newAcc);
        saveLocalStorageData(MOCK_DB.connected_accounts, filtered);
        notifyObservers("connected_accounts");
        resolve(newAcc.id);
      }, 500);
    });
  }

  // Real Firestore
  const docRef = await addDoc(collection(db, "connected_accounts"), {
    userId,
    connectedAt: serverTimestamp(),
    status: "connected",
    ...accountData
  });
  return docRef.id;
};

export const deleteConnectedAccount = async (accountId) => {
  if (isSimulationMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const accounts = getLocalStorageData(MOCK_DB.connected_accounts);
        const filtered = accounts.filter(a => a.id !== accountId);
        saveLocalStorageData(MOCK_DB.connected_accounts, filtered);
        notifyObservers("connected_accounts");
        resolve();
      }, 400);
    });
  }

  // Real Firestore
  const docRef = doc(db, "connected_accounts", accountId);
  return deleteDoc(docRef);
};

export const subscribeToConnectedAccounts = (userId, callback) => {
  if (isSimulationMode) {
    const filterFn = (list) => list.filter(item => item.userId === userId || userId === "demo_user");
    const observer = { callback, filterFn };
    dbObservers.connected_accounts.add(observer);
    callback(filterFn(getLocalStorageData(MOCK_DB.connected_accounts)));
    return () => {
      dbObservers.connected_accounts.delete(observer);
    };
  }

  // Real Firestore
  const q = query(
    collection(db, "connected_accounts"),
    where("userId", "==", userId)
  );
  return onSnapshot(q, (snapshot) => {
    const list = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    callback(list);
  });
};

// 3. Log auto DMs / Messages
export const logAutoDM = async (userId, messageData) => {
  if (isSimulationMode) {
    const messages = getLocalStorageData(MOCK_DB.messages);
    const newMsg = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      userId,
      timestamp: new Date().toISOString(),
      ...messageData
    };
    messages.unshift(newMsg);

    // Limit to latest 50 messages
    const trimmed = messages.slice(0, 50);
    saveLocalStorageData(MOCK_DB.messages, trimmed);
    notifyObservers("messages");

    // Increment timesTriggered on the automation rule
    if (messageData.triggeredKeyword) {
      const automations = getLocalStorageData(MOCK_DB.automations);
      const updatedAutomations = automations.map(auto => {
        // Match keyword
        const lowerReceived = messageData.receivedMessage.toLowerCase();
        const hasKeyword = auto.keywords.some(kw => lowerReceived.includes(kw.toLowerCase()));
        if (hasKeyword && auto.isActive && auto.platform === messageData.platform) {
          return { ...auto, timesTriggered: auto.timesTriggered + 1 };
        }
        return auto;
      });
      saveLocalStorageData(MOCK_DB.automations, updatedAutomations);
      notifyObservers("automations");
    }

    return newMsg.id;
  }

  // Real Firestore
  const docRef = await addDoc(collection(db, "messages"), {
    userId,
    timestamp: serverTimestamp(),
    ...messageData
  });
  return docRef.id;
};

export const subscribeToRecentMessages = (userId, callback) => {
  if (isSimulationMode) {
    const filterFn = (list) => list.filter(item => item.userId === userId || userId === "demo_user");
    const observer = { callback, filterFn };
    dbObservers.messages.add(observer);
    callback(filterFn(getLocalStorageData(MOCK_DB.messages)));
    return () => {
      dbObservers.messages.delete(observer);
    };
  }

  // Real Firestore
  const q = query(
    collection(db, "messages"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(20)
  );
  return onSnapshot(q, (snapshot) => {
    const list = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    callback(list);
  });
};

// 4. Sync Auth User profiles to Firestore Users collection
export const syncUserToFirestore = async (user) => {
  if (!user || isSimulationMode) return;
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      lastLoginAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error("Error syncing user profile to Firestore: ", err);
  }
};
