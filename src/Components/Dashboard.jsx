import {Chart, PieChart} from "./Chart";

import Sidebar from "./Sidebar";
import {useEffect, useState} from "react";
import {db} from "../auth";
import {collection, getDocs} from "firebase/firestore";
const Dashboard = () => {

    // get patients from patients collection
    const [patients, setPatients] = useState([])

    // one patients data:
// email: "njiruclinton56@gmail.com"
// name: "Clinton"
// result: Array [ "Malignant", null ]
    // 0: "Malignant"
    // 1: null
    // length: 2

    // number of malignant cases and benign cases

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

    // benign cases
    // const benignCases = patients.filter(patient => patient.result[0] === "Benign")
    // // malignant cases
    // const malignantCases = patients.filter(patient => patient.result[0] === "Malignant")

    //  some patients don't have results so it becomes undefined, so filter on patients who have results field
    const benignCases = patients.filter(patient => patient.result && patient.result[0] === "Benign")
    const malignantCases = patients.filter(patient => patient.result && patient.result[0] === "Malignant")








    return (
        <div>
           <Sidebar />

            <div className="p-4 sm:ml-64 ">
                <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-900">Overview</h1>
                <div className="flex items-center mt-6 mr-10">
                    <div className="flex-shrink-0 bg-gray-700 rounded-full hover:opacity-75 transition duration-300 ease-in-out">
                        <img className="w-12 h-12 rounded-full" src={require("../assets/logo.png")} alt="avatar" />
                    </div>
                </div>
            </div>
                <div className="flex flex-wrap mt-6 mb-5">
                <div className="flex flex-wrap w-1/2">

                    <div className="flex flex-col items-center justify-center mb-5 mr-5 min-w-[300px] p-7 bg-white border-2 border-solid rounded-lg hover:bg-[#c8529e] hover:text-white transition duration-75 ease-in-out cursor-pointer">
                        <div className="flex items-center mb-3">
                            <p className="mx-3 text-3xl">Malignant</p>
                        </div>
                        <p className="text-3xl font-semibold opacity-75 ">{
                            malignantCases.length
                        }</p>
                    </div>
                    <div className="flex flex-col items-center justify-center mb-5 min-w-[300px] p-7 bg-white border-2 border-solid rounded-lg hover:bg-[#c8529e] hover:text-white transition duration-75 ease-in-out cursor-pointer">
                        <div className="flex items-center mb-3">
                            <p className="mx-3 text-3xl">Benign</p>
                        </div>
                        <p className="text-3xl font-semibold opacity-75">{
                            benignCases.length
                        }</p>
                    </div>
                    <div className="flex flex-col items-center justify-center mr-5 min-w-[300px] p-7 bg-white border-2 border-solid rounded-lg hover:bg-[#c8529e] hover:text-white transition duration-75 ease-in-out cursor-pointer
                    ">
                        <div className="flex items-center mb-3">
                            <p className="mx-3 text-3xl">Patients</p>
                        </div>

                        <p className="text-3xl font-semibold opacity-75">{
                            patients.length
                        }</p>
                    </div>
                    <div className="flex flex-col items-center justify-center min-w-[300px] p-7 bg-white border-2 border-solid rounded-lg hover:bg-[#c8529e] hover:text-white transition duration-75 ease-in-out cursor-pointer">
                        <div className="flex items-center mb-3">
                            <p className="mx-3 text-3xl">Doctors</p>
                        </div>
                        <p className="text-3xl font-semibold opacity-75">5</p>
                    </div>
                </div>
                    <div className="w-1/2">
                        <Chart />
                    </div>
                </div>
                <PieChart malignant={malignantCases.length} benign={benignCases.length}
                />
            </div>





        </div>
    )
}

export default Dashboard;