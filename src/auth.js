import { getAuth } from "firebase/auth"; // Add this line to import getAuth

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyDBpTlredH1Zq35LGZuiztCJ9z12JdQSAU",
    authDomain: "bctc-rawlinz-jeffproject.firebaseapp.com",
    projectId: "bctc-rawlinz-jeffproject",
    storageBucket: "bctc-rawlinz-jeffproject.appspot.com",
    messagingSenderId: "1053088381150",
    appId: "1:1053088381150:web:1cbc40e99566fe93a7ea4f",
    measurementId: "G-X6WLDDBQG5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Create the AuthContext
const AuthContext = createContext(null);

// Define a custom hook to handle the authentication state
const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Add your authentication state management logic here
        // For example, using Firebase Auth:
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        return unsubscribe;
    }, []);

    return { currentUser };
};

export { auth, db, AuthContext, useAuth };

