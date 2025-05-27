// Firebase 설정 및 초기화
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase 구성
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAlH_l4pN_2Hp640_awBIfLbgmaGOpmbLE',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'facebattle-782ef.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'facebattle-782ef',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'facebattle-782ef.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://facebattle-782ef-default-rtdb.asia-southeast1.firebasedatabase.app',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase 앱 초기화 (중복 초기화 방지)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = null; // Storage 사용하지 않음 (호환성 유지)
const auth = getAuth(app);
const rtdb = getDatabase(app);

export { app, db, storage, auth, rtdb }; 