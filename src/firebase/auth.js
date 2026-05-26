import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider, isSimulationMode } from "./config";

// --- MOCK / SIMULATION IMPLEMENTATION ---
const MOCK_USER_KEY = "insta_auto_dm_mock_user";
const MOCK_USERS_DB_KEY = "insta_auto_dm_mock_users_db";

const getMockUsers = () => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(MOCK_USERS_DB_KEY);
  return users ? JSON.parse(users) : [];
};

const saveMockUser = (user) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
};

const getActiveMockUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(MOCK_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Simulated auth state listeners
const mockListeners = new Set();

const triggerMockAuthStateChanged = (user) => {
  mockListeners.forEach(callback => callback(user));
};

// --- AUTH API ---

export const signUpWithEmail = async (email, password, displayName) => {
  if (isSimulationMode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        if (users.some(u => u.email === email)) {
          reject(new Error("auth/email-already-in-use"));
          return;
        }

        const newUser = {
          uid: "mock_" + Math.random().toString(36).substr(2, 9),
          email,
          displayName: displayName || email.split("@")[0],
          photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName || email)}`,
          emailVerified: true
        };

        users.push({ ...newUser, password });
        localStorage.setItem(MOCK_USERS_DB_KEY, JSON.stringify(users));
        saveMockUser(newUser);
        triggerMockAuthStateChanged(newUser);
        resolve({ user: newUser });
      }, 800);
    });
  }

  // Real Firebase
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, {
      displayName: displayName,
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`
    });
  }
  return userCredential;
};

export const logInWithEmail = async (email, password) => {
  if (isSimulationMode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          reject(new Error("auth/invalid-credential"));
          return;
        }

        const loggedInUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };

        saveMockUser(loggedInUser);
        triggerMockAuthStateChanged(loggedInUser);
        resolve({ user: loggedInUser });
      }, 800);
    });
  }

  // Real Firebase
  return signInWithEmailAndPassword(auth, email, password);
};

export const logInWithGoogle = async () => {
  if (isSimulationMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          uid: "mock_google_" + Math.random().toString(36).substr(2, 9),
          email: "demo.user@gmail.com",
          displayName: "Demo User",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=DemoUser"
        };
        saveMockUser(mockUser);
        triggerMockAuthStateChanged(mockUser);
        resolve({ user: mockUser });
      }, 800);
    });
  }

  // Real Firebase
  return signInWithPopup(auth, googleProvider);
};

export const logOutUser = async () => {
  if (isSimulationMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(MOCK_USER_KEY);
        }
        triggerMockAuthStateChanged(null);
        resolve();
      }, 400);
    });
  }

  // Real Firebase
  return signOut(auth);
};

export const onAuthStateChangedListener = (callback) => {
  if (isSimulationMode) {
    mockListeners.add(callback);
    // Immediately call with current state
    const currentUser = getActiveMockUser();
    callback(currentUser);
    
    // Return unsubscribe function
    return () => {
      mockListeners.delete(callback);
    };
  }

  // Real Firebase
  return onAuthStateChanged(auth, callback);
};

export const getLiveCurrentUser = () => {
  if (isSimulationMode) {
    return getActiveMockUser();
  }
  return auth ? auth.currentUser : null;
};
