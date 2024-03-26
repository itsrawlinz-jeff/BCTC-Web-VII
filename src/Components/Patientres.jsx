import Sidebar from "./UserSidebar";
import {useEffect, useState} from "react";
import {EditUsersModal, DeleteModal} from "./MyModals";
import {db} from "../auth";
import {getDocs, getDoc, collection, where, query} from "firebase/firestore";
import { useAuthValue } from "../AuthContext";



let totalPatients = 0
const Patientres = () => {
    const [patients, setPatients] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState('')
    const [filteredPatients, setFilteredPatients] = useState([])
    const {currentUser} = useAuthValue();

    useEffect(() => {
        // if user email does not exist as a document id in the patients collection, do not display this page
        const q = query(collection(db, "patients"), where("email", "==", currentUser.email));
        getDocs(q).then((querySnapshot) => {
            if (querySnapshot.size === 0) {
                window.location.href = "/"
            }
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }, [currentUser.email])



    const handleOnClose = () => {
        setShowModal(false)
        window.location.reload()
    }

    const [showEditModal, setShowEditModal] = useState(false)
    const [patientData, setPatientData] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)


    const handleEditOnClose = () => {
        setShowEditModal(false)
        window.location.reload()
    }
    const handleDeleteOnClose = () => {
        setShowDeleteModal(false)
        window.location.reload()
    }

    useEffect(() => {
        const getUsers = async () => {
            try {
                const q = query(collection(db, "patients"), where("email", "==", currentUser.email))
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setPatients([...patients, doc.data()])
                    console.log(doc.id, " => ", doc.data());
                });

            } catch (e){
                console.log("error getting docs", e)
            }
        }
        getUsers().then(r => console.log("done22")) // or console.log(r)
            .catch(e => console.log(e))

    }, []);

    totalPatients = patients.length

    useEffect(() => {
        setFilteredPatients(
            patients.filter(patient => {
                return patient.name.toLowerCase().includes(search.toLowerCase())
                // || tenant.email.toLowerCase().includes(search.toLowerCase()) || tenant.phone.toLowerCase().includes(search.toLowerCase()) || tenant.door.toLowerCase().includes(search.toLowerCase())
            })
        )

    }, [search, patients])


    const handleSub = (tenant) => () => {
        setShowEditModal(true)
        const patientData = patients.filter(t => t.email === tenant)
        setPatientData(patientData)
    }


    const handleDel = (tenant) => () => {
        setShowDeleteModal(true)
        const patientData = patients.filter(t => t.email === tenant)
        setPatientData(patientData)
    }


    return (
        <div>
<Sidebar />

            <div className="p-4 sm:ml-64">
                <div className="flex justify-between mt-11 mb-5">
                    <h1 className="text-4xl font-bold font-poppins">
                        Patients' Results
                    </h1>
                    {/*<button onClick={() => setShowModal(true)} data-modal-target="default-modal" data-modal-toggle="default-modal" className="bg-[#1989e5] font-poppins hover:bg-blue-400 text-white font-bold py-3 px-4 rounded-2xl">*/}
                    {/*    Create patient*/}
                    {/*</button>*/}
                </div>

                <EditUsersModal onClose={handleOnClose} visible={showModal} />

                <p className="opacity-65 font-semibold mb-5 text-xl">View Results</p>

                <div>
                    {/* <form>
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input onChange={(e) => setSearch(e.target.value)}
                                   type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Patients..." required/>
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                        </div>
                    </form> */}


                    <div  className="mt-5">

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Patient name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Phone
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Age
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Gender
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Results
                                    </th>
                                    {/* <th scope="col" className="px-6 py-3">
                                        Action
                                    </th> */}
                                </tr>
                                </thead>
                                <tbody>

                                {patients.map((patient, index) => (
                                    <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {patient.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {patient.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {patient.phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            {patient.age}
                                        </td>
                                        <td className="px-6 py-4">
                                            {patient.gender}
                                        </td>
                                        <td className="px-6 py-4">
                                            {
                                                patient.result && patient.result[0] === "Malignant" ? <span className="bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-300 rounded-full px-3 py-1 text-xs font-semibold">Malignant</span> :
                                                    patient.result && patient.result[0] === "Benign" ?
                                                    <span className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-300 rounded-full px-3 py-1 text-xs font-semibold">Benign</span> : "No result yet"
                                            }
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <button onClick={handleSub(patient.email)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                            <button onClick={handleDel(patient.email)} className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Remove</button>
                                            <DeleteModal onDeleteClose={handleDeleteOnClose} deleteVisible={showDeleteModal} id={patientData} />


                                            <EditUsersModal onEditClose={handleEditOnClose} editVisible={showEditModal} id={patientData} />
                                        </td> */}

                                    </tr>
                                ))}

                                </tbody>
                            </table>
                        </div>


                    </div>

                </div>
            </div>

        </div>
    )
}

export default Patientres