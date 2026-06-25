// === Firebase Configuration ===
// Paste your Firebase Web Config object here once you create a project in Firebase Console.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Auto-check if configuration is provided
const isFirebaseEnabled = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
