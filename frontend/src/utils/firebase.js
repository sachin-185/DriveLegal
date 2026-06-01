// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBinmINb7OrI9vjPn7C_6dEqyMZEfXBnLk",
  authDomain: "aichatbot-fabc6.firebaseapp.com",
  projectId: "aichatbot-fabc6",
  storageBucket: "aichatbot-fabc6.firebasestorage.app",
  messagingSenderId: "191330533215",
  appId: "1:191330533215:web:4a54ce4335dcc7313500ea",
  measurementId: "G-4LRWZFLMSR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In helper that integrates Firestore profile creation/retrieval
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Retrieve user document from firestore users collection
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  let profileData;
  if (!docSnap.exists()) {
    // New user profile - automatically initialize with default safety stats
    profileData = {
      id: 'DL-' + Math.floor(100000 + Math.random() * 900000),
      fullName: user.displayName || 'Google Driver',
      username: (user.email.split('@')[0] + Math.floor(Math.random() * 100)).toLowerCase(),
      email: user.email,
      licenseNo: 'G-LICENSE-' + Math.floor(100000 + Math.random() * 900000),
      region: 'IN', // default driving region
      safetyScore: 100,
      badges: [],
      registeredAt: new Date().toISOString()
    };
    await setDoc(userRef, profileData);
  } else {
    // Existing user profile - retrieve saved safety stats
    profileData = docSnap.data();
  }

  return profileData;
}

// Google Sign-Out helper
export async function signOutUser() {
  await signOut(auth);
}

// Initialize Analytics conditionally (safely handles environments without window/document objects)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
