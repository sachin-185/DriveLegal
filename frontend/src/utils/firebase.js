import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBinmINb7OrI9vjPn7C_6dEqyMZEfXBnLk",
  authDomain: "aichatbot-fabc6.firebaseapp.com",
  projectId: "aichatbot-fabc6",
  storageBucket: "aichatbot-fabc6.firebasestorage.app",
  messagingSenderId: "191330533215",
  appId: "1:191330533215:web:4a54ce4335dcc7313500ea",
  measurementId: "G-4LRWZFLMSR"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = (() => {
  try {
    return getFirestore(app, 'default');
  } catch (e) {
    return getFirestore(app);
  }
})();
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  let profileData = {
    id: 'DL-' + Math.floor(100000 + Math.random() * 900000),
    fullName: user.displayName || 'Google Driver',
    username: (user.email ? user.email.split('@')[0] : 'driver') + Math.floor(Math.random() * 100),
    email: user.email || '',
    licenseNo: 'DL-IN-' + Math.floor(100000 + Math.random() * 900000),
    region: 'IN',
    safetyScore: 100,
    badges: ['Google Verified Driver'],
    registeredAt: new Date().toISOString()
  };

  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, profileData);
    } else {
      profileData = docSnap.data();
    }
  } catch (firestoreErr) {
    console.warn("Firestore database sync skipped (Cloud Firestore (default) database has not been created yet in Firebase Console). Logging in with Google Auth profile.", firestoreErr);
  }
  return profileData;
}

export async function signOutUser() {
  await signOut(auth);
}

let analyticsInstance = null;
if (typeof window !== 'undefined') {
  try {
    analyticsInstance = getAnalytics(app);
  } catch (e) {
    // Analytics optional or suppressed in offline/sandboxed environments
  }
}
export const analytics = analyticsInstance;