import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {AddUserModal} from "./MyModals";
import {signOut} from "firebase/auth";
import {auth, db} from "../auth";
import {collection, getDocs, where, query} from "firebase/firestore";
import {EditPatientsModal} from "./MyModals";
import { useAuthValue } from "../AuthContext";


const Sidebar = () => {
    const [showModal, setShowModal] = useState(false)
    const [patients, setPatients] = useState([])
    const [patient, setPatient] = useState({})
    const {currentUser} = useAuthValue();

    const handleOnClose = () => {
        setShowModal(false)
        window.location.reload()
    }

    const navigate = useNavigate();
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate('/')
            })
            .catch((error) => {
                console.error(error.message)
            })
    }

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "patients"));
                const data = querySnapshot.docs.map((doc) => doc.data());
                setPatients(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPatients().then(r => r)
    }, [])


    // logged in patient data
    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const q = query(collection(db, "patients"), where("email", "==", currentUser.email))
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setPatient([...patients, doc.data()])
                    console.log(doc.id, " => ", doc.data());
                });
            } catch (error) {
                console.log(error)
            }
        }
        fetchPatient().then(r => r)
    }, [])




    return(
        <div>
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>


            <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">

                <div className="flex items-center justify-center bg-gray-700">
                    <img src={require("../assets/logo.png")} alt="logo" className="w-12 h-12" />
                </div>

                <div className="h-full px-3 py-4 overflow-y-auto bg-[#228db9] ">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to="/dashboard" className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 group">
                                <svg className="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                                </svg>
                                <span className="ms-3 font-bold"></span>
                            </NavLink>
                        </li>
                        <li>
                            <button onClick={() => setShowModal(true)} className="w-full flex items-center p-2 text-gray-900  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span  className="ms-3 font-bold whitespace-nowrap">Update Profile</span>
                            </button>
                        </li>
                        <li>
                            <NavLink to="/patientres" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap font-bold">View My Results</span>
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                    {
                                        patients.length
                                    }
                                </span>
                            </NavLink>
                        </li>

                        {/*<li>*/}
                        {/*    <NavLink to="/results" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">*/}
                        {/*        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">*/}
                        {/*            <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />*/}
                        {/*        </svg>*/}


                        {/*        <span className="flex-1 ms-3 whitespace-nowrap font-bold">View Results</span>*/}

                        {/*    </NavLink>*/}
                        {/*</li>*/}

                    </ul>
                    <div className="absolute inset-x-0 bottom-0 p-5 bg-gray-700 ">
                        <button className="flex items-center w-full p-2 text-white font-bold rounded-lg dark:text-white hover:opacity-75 transition duration-300 ease-in-out group " onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>
                            <span className="flex-1 ms-3 whitespace-nowrap">Sign out</span>
                        </button>
                    </div>

                </div>
            </aside>

            <EditPatientsModal onEditClose={handleOnClose} editVisible={showModal} id={patient}/>

        </div>
    )
}

export default Sidebar