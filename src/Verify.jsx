import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuthValue} from "./AuthContext";
import {sendEmailVerification} from "firebase/auth";
import {auth} from "./auth";

const VerifyEmail = () => {
    const {currentUser} = useAuthValue()
    const [time, setTime] = useState(60)
    const {timeActive, setTimeActive} = useAuthValue()
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            currentUser?.reload()
                .then(() => {
                    if(currentUser?.emailVerified){
                        clearInterval(interval)
                        navigate('/dashboard')
                    }
                })
                .catch((err) => {
                    alert(err.message)
                })
        }, 1000)
    }, [navigate, currentUser])

    useEffect(() => {
        let interval = null
        if(timeActive && time !== 0 ){
            interval = setInterval(() => {
                setTime((time) => time - 1)
            }, 1000)
        }else if(time === 0){
            setTimeActive(false)
            setTime(60)
            clearInterval(interval)
        }
        return () => clearInterval(interval);
    }, [timeActive, time, setTimeActive])

    const resendEmailVerification = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                setTimeActive(true)
            }).catch((err) => {
            alert(err.message)
        })
    }

    // style using tailwindcss
    return (
        // <div className='center'>
        //     <div className='verifyEmail'>
        //         <h1>Verify your Email Address</h1>
        //         <p>
        //             <strong>A Verification email has been sent to:</strong><br/>
        //             <span>{currentUser?.email}</span>
        //         </p>
        //         <span>Follow the instruction in the email to verify your account</span>
        //         <button
        //             onClick={resendEmailVerification}
        //             disabled={timeActive}
        //         >Resend Email {timeActive && time}</button>
        //     </div>
        // </div>
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-xs">
                <h1 className="text-3xl mb-4 text-center">Verify your Email Address</h1>
                <p>
                    <strong>A Verification email has been sent to:</strong><br/>
                    <span>{currentUser?.email}</span>
                </p>
                <p>Follow the instruction in the email to verify your account</p>
                <button
                    onClick={resendEmailVerification}
                    disabled={timeActive}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >Resend Email {timeActive && time}</button>
            </div>
        </div>

    );
};

export default VerifyEmail;