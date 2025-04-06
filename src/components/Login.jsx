// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 text-center">
      {!user ? (
        <>
          <h2 className="text-xl mb-4">Login with Google</h2>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign In with Google
          </button>
        </>
      ) : (
        <div>
          <h2 className="text-xl mb-2">Welcome, {user.displayName}</h2>
          <p className="mb-4">{user.email}</p>
          <img
            src={user.photoURL}
            alt="User avatar"
            className="mx-auto rounded-full w-24 h-24"
          />
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
