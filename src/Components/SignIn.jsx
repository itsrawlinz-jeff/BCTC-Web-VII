import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../auth"; 
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth.currentUser?.emailVerified === true) {
            checkUserRole(auth.currentUser.email);
        }
    }, []);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (auth.currentUser) {
                if (auth.currentUser.emailVerified) {
                    checkUserRole(auth.currentUser.email);
                } else {
                    await sendEmailVerification(auth.currentUser);
                    navigate('/verify-email');
                }
            }
        } catch (error) {
            let errorMessage = "Authentication failed";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
            console.error(errorMessage);
        }
        setLoading(false);
    }
    
    const checkUserRole = async (email) => {
        try {
            const docRef = doc(db, "patients", email);
            const userDoc = await getDoc(docRef);
            if (userDoc.exists()) {
                navigate('/useddashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            setError("Error retrieving user data");
            console.error("Error retrieving user data:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSignIn} className="w-full max-w-xs">
                <h1 className="text-3xl mb-4 text-center">Sign In</h1>
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>{error}</p>
                </div>}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SignIn;
