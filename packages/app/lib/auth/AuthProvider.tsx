'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import type { IUser } from '@brujula-cripto/types';
import {
  type User,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';

import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: IUser | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signInWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  logout: async () => {},
  isAdmin: false,
});

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTranslations('lib.errors.auth');
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const handleAuthStateChange = async (firebaseUser: User | null): Promise<void> => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Obtener datos adicionales del usuario de Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data() as IUser;
            setUserData(data);
          }

          // Verificar claims de admin
          const tokenResult = await firebaseUser.getIdTokenResult();
          setIsAdmin(!!tokenResult.claims.admin);
        } catch (error) {
          console.error(t('getUserData'), error);
        }
      } else {
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    return (): void => {
      unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : t('signIn'));
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Crear documento de usuario si no existe
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUserData: IUser = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          isAdmin: false,
          isPremium: false,
          usageCreditsInSeconds: 2700, // 15min herramientas + 30min chatbot inicial
          createdAt: new Date(),
          lastLoginAt: new Date(),
          preferences: {
            language: 'es',
            theme: 'system',
            notifications: true,
          },
        };

        await setDoc(userDocRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : t('googleSignIn'));
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Crear documento de usuario
      const newUserData: IUser = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        isAdmin: false,
        isPremium: false,
        usageCreditsInSeconds: 2700, // 15min herramientas + 30min chatbot inicial
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          language: 'es',
          theme: 'system',
          notifications: true,
        },
      };

      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, newUserData);
      setUserData(newUserData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : t('createAccount'));
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : t('resetPassword'));
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : t('signOut'));
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    resetPassword,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
