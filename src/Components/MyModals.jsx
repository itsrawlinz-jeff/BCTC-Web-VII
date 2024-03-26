import React from 'react';
import {useForm} from "react-hook-form";
import {auth, db} from "../auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthValue } from "../AuthContext";

const AddUserModal = ({ visible, onClose }) => {

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();


    if(!visible) return null;


    const onSubmit = async (data) => {
        console.log(data);
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

        await setDoc(doc(db, "patients", data.email), {
            name: data.name,
            email: data.email,
            phone: data.phone,
            age: data.age,
            gender: data.gender,
            role: "patient"
        })
            .then(() => {
                console.log("Document successfully written!");
                onClose()
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div id="authentication-modal" tabIndex={-1} aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="font-poppins text-xl font-semibold text-gray-900 dark:text-white">
                                Add new patient
                            </h3>
                            <button onClick={onClose} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" action="#">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient name</label>
                                    <input {...register("name", { required: true })}
                                           type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name" required/>
                                    {errors.name && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient email</label>
                                    <input {...register("email", { required: true })}
                                           type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@gmail.com" required/>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                    <input {...register('phone', {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Please enter only numbers',
                                        },
                                        maxLength: {
                                            value: 12,
                                            message: 'Phone number must be at most 12 digits',
                                        },
                                    })}
                                           type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="2547..." required/>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient gender</label>
                                    <input {...register("gender", { required: true })}
                                           type="text" name="gender" id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="gender" required/>
                                    {errors.gender && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient age</label>
                                    <input {...register("age", { required: true })}
                                           type="text" name="age" id="age" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="age" required/>
                                    {errors.age && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                                    <input {...register("password", { required: true })}
                                           type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat your password</label>
                                    <input {...register("confirm_password", {
                                        required: true,
                                        validate: (val) => {
                                            if (watch('password') !== val) {
                                                return "Your passwords do no match";
                                            }
                                        },
                                    })}
                                           type="password" name="confirm_password" id="confirm_password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required/>
                                    {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
                                </div>

                                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create new patient</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

const EditUsersModal = ({editVisible, onEditClose, id}) => {


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    if(!editVisible) return null;



    const onSubmit = async (data) => {
        console.log(data);
        const docRef = doc(db, "patients", id[0].email);
        await updateDoc(docRef, {
            name: data.name,
            phone: data.phone,
            age: data.age,
            gender: data.gender
        })
            .then(() => {
                console.log("Document successfully written!");
            //     clear data
                onEditClose()
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }


    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div id="authentication-modal" tabIndex="-1" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="font-poppins text-xl font-semibold text-gray-900 dark:text-white">
                                    Update patient
                                </h3>
                                <button onClick={onEditClose} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5">
                                {
                                    id.map((patient, index) => (

                                        <form key={index} onSubmit={handleSubmit(onSubmit)} className="space-y-4" action="#">
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient name</label>
                                                <input {...register("name", { required: true })}
                                                       type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={patient.name}
                                                />
                                                {errors.name && <p className="text-red-500 text-xs mt-1">This field is required</p>}

                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                                <input {...register("phone", { required: true })}
                                                       type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={patient.phone} />
                                                {errors.phone && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="door" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient age</label>
                                                <input {...register("age", { required: true })}
                                                       type="text" name="age" id="age" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={patient.age} />
                                                {errors.age && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="door" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                                                <input {...register("gender", { required: true })}
                                                       type="text" name="gender" id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={patient.gender} />
                                                {errors.gender && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                            </div>

                                            <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                                        </form>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



const EditPatientsModal = ({editVisible, onEditClose, id}) => {
    const {currentUser} = useAuthValue();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    if(!editVisible) return null;



    const onSubmit = async (data) => {
        console.log(data);
        const docRef = doc(db, "patients", id[0].email);
        await updateDoc(docRef, {
            name: data.name,
            phone: data.phone,
            age: data.age,
            gender: data.gender
        })
            .then(() => {
                console.log("Document successfully written!");
            //     clear data
                onEditClose()
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }


    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div id="authentication-modal" tabIndex="-1" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="font-poppins text-xl font-semibold text-gray-900 dark:text-white">
                                    Update patient
                                </h3>
                                <button onClick={onEditClose} type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5">
                                {
                                    id.map((patient, index) => (

                                        <form key={index} onSubmit={handleSubmit(onSubmit)} className="space-y-4" action="#">
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient name</label>
                                                <input {...register("name", { required: true })}
                                                       type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={patient.name}
                                                />
                                                {errors.name && <p className="text-red-500 text-xs mt-1">This field is required</p>}

                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
                                                <input {...register("phone", { required: true })}
                                                       type="text" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={patient.phone} />
                                                {errors.phone && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="door" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient age</label>
                                                <input {...register("age", { required: true })}
                                                       type="text" name="age" id="age" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={patient.age} />
                                                {errors.age && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="door" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                                                <input {...register("gender", { required: true })}
                                                       type="text" name="gender" id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={patient.gender} />
                                                {errors.gender && <p className="text-red-500 text-xs mt-1">This field is required</p>}
                                            </div>

                                            <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                                        </form>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



const DeleteModal = ({deleteVisible, onDeleteClose, id}) => {
    if(!deleteVisible) return null;

    const handleDelete = async () => {
        const docaddRef = doc(db, "deleted_patients", id[0].email);
        await setDoc(docaddRef, {
            name: id[0].name,
            email: id[0].email,
            phone: id[0].phone,
            age: id[0].age,
            gender: id[0].gender
        })
        const docRef = doc(db, "patients", id[0].email);
        await deleteDoc(docRef)
            .then(() => {
                console.log("Document successfully deleted!");
                onDeleteClose()
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            })

    }

    return (
        <div>
            <div id="popup-modal" tabIndex="-1" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                            <button onClick={handleDelete} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                Yes, I'm sure
                            </button>
                            <button onClick={onDeleteClose} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export { AddUserModal, EditUsersModal, DeleteModal, EditPatientsModal }