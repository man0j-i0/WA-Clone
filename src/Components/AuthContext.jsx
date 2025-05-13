import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// 1. Context creation
const AuthContext = React.createContext();

// Hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// AuthWrapper Component
function AuthWrapper({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser?.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { profile_pic, email, name, status } = docSnap.data();
          console.log("User data from Firestore:", docSnap.data());

          // Set custom profile pic (stored in Firestore)
          setUserData({
            id: currentUser?.uid,
            profile_pic: profile_pic || currentUser?.photoURL || null, // Prioritize Firestore
            email,
            name,
            status: status || "",
          });

          updateLastSeen(currentUser);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateLastSeen = async (user) => {
    const date = new Date();
    const timeStamp = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    await updateDoc(doc(db, "users", user.uid), {
      lastSeen: timeStamp,
    });
  };

  const updateName = async (name) => {
    await updateDoc(doc(db, "users", userData.id), {
      name: name,
    });
    setUserData({ ...userData, name });
  };

  const updateStatus = async (status) => {
    await updateDoc(doc(db, "users", userData.id), {
      status: status,
    });
    setUserData({ ...userData, status });
  };

  const updatePhoto = async (img) => {
    const storageRef = ref(storage, `profile/${userData.id}`);
    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      () => {
        setIsUploading(true);
      },
      (error) => {
        console.error("Upload failed:", error);
        setError("Unable to upload.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        // Update Firestore with new profile picture
        await updateDoc(doc(db, "users", userData.id), {
          profile_pic: downloadURL,
        });

        // Optionally update Firebase Auth's photoURL
        await updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        });

        setUserData((prev) => ({
          ...prev,
          profile_pic: downloadURL,
        }));
        setIsUploading(false);
        setError(null);
      }
    );
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        setUserData,
        userData,
        loading,
        logout,
        updateName,
        updateStatus,
        updatePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthWrapper;
