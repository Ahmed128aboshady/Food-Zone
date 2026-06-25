// === Firebase Database Adapter Layer ===
window.FzDb = {
  db: null,
  storage: null,

  // Check if Firebase is enabled and script is loaded
  isEnabled() {
    return isFirebaseEnabled && (typeof firebase !== 'undefined');
  },

  // Initialize Firebase and setup Firestore & Storage references
  init() {
    if (this.isEnabled()) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        this.db = firebase.firestore();
        this.storage = firebase.storage();
        console.log("Firebase initialized successfully! Cloud Mode Active.");
        
        // Auto-seed Firestore if it is empty
        this.seedIfEmpty();
      } catch (err) {
        console.error("Failed to initialize Firebase:", err);
      }
    } else {
      console.log("Firebase is not configured or scripts not loaded. Local Storage Mode Active.");
    }
  },

  // Auto-seed default database users and ads if Firestore is empty
  async seedIfEmpty() {
    if (!this.isEnabled()) return;
    try {
      const snap = await this.db.collection('users').limit(1).get();
      if (snap.empty) {
        console.log("Firestore is empty. Syncing local localStorage database to cloud...");
        
        // Seed users
        const localUsers = JSON.parse(localStorage.getItem('fz_users')) || [];
        for (let user of localUsers) {
          await this.db.collection('users').doc(user.id.toString()).set(user);
        }
        
        // Seed ads
        const localAds = JSON.parse(localStorage.getItem('fz_ads')) || [];
        for (let ad of localAds) {
          await this.db.collection('ads').doc(ad.id.toString()).set(ad);
        }
        
        console.log("Firestore successfully seeded with default data!");
      }
    } catch (err) {
      console.error("Error seeding Firestore:", err);
    }
  },

  // === USERS API ===
  async getUsers() {
    if (this.isEnabled()) {
      try {
        const snap = await this.db.collection('users').get();
        const users = [];
        snap.forEach(doc => users.push(doc.data()));
        if (users.length > 0) {
          // Keep local cache updated
          localStorage.setItem('fz_users', JSON.stringify(users));
          return users;
        }
      } catch (err) {
        console.error("Firestore getUsers failed, using localStorage cache:", err);
      }
    }
    return JSON.parse(localStorage.getItem('fz_users')) || [];
  },

  async saveUser(user) {
    // 1. Save to local storage for instant sync and offline support
    let users = JSON.parse(localStorage.getItem('fz_users')) || [];
    const idx = users.findIndex(u => u.id.toString() === user.id.toString());
    if (idx > -1) users[idx] = user;
    else users.push(user);
    localStorage.setItem('fz_users', JSON.stringify(users));
    
    // Update active session if saving self
    const session = JSON.parse(localStorage.getItem('fz_session'));
    if (session && session.id.toString() === user.id.toString()) {
      localStorage.setItem('fz_session', JSON.stringify(user));
    }

    // 2. Save to Firestore
    if (this.isEnabled()) {
      try {
        await this.db.collection('users').doc(user.id.toString()).set(user);
        console.log(`User ${user.name} saved to Cloud Firestore.`);
      } catch (err) {
        console.error("Firestore saveUser failed:", err);
      }
    }
  },

  // === ADS API ===
  async getAds() {
    if (this.isEnabled()) {
      try {
        const snap = await this.db.collection('ads').get();
        const ads = [];
        snap.forEach(doc => ads.push(doc.data()));
        if (ads.length > 0) {
          localStorage.setItem('fz_ads', JSON.stringify(ads));
          return ads;
        }
      } catch (err) {
        console.error("Firestore getAds failed, using local storage:", err);
      }
    }
    return JSON.parse(localStorage.getItem('fz_ads')) || [];
  },

  async saveAd(ad) {
    let ads = JSON.parse(localStorage.getItem('fz_ads')) || [];
    const idx = ads.findIndex(a => a.id.toString() === ad.id.toString());
    if (idx > -1) ads[idx] = ad;
    else ads.push(ad);
    localStorage.setItem('fz_ads', JSON.stringify(ads));

    if (this.isEnabled()) {
      try {
        await this.db.collection('ads').doc(ad.id.toString()).set(ad);
      } catch (err) {
        console.error("Firestore saveAd failed:", err);
      }
    }
  },

  // === FILE UPLOAD API (Firebase Storage) ===
  async uploadFile(path, file) {
    if (this.isEnabled()) {
      try {
        const ref = this.storage.ref().child(path);
        const snap = await ref.put(file);
        const url = await snap.ref.getDownloadURL();
        console.log(`File uploaded successfully to: ${url}`);
        return url;
      } catch (err) {
        console.error("Firebase Storage upload failed:", err);
        throw err;
      }
    }
    throw new Error("Firebase Storage is not enabled or configured.");
  }
};

// Auto-initialize
window.addEventListener('DOMContentLoaded', () => {
  window.FzDb.init();
});
