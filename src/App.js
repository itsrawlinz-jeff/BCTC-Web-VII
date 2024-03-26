import React, {useEffect, useState} from 'react';
import SignIn from "./Components/SignIn";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import VerifyEmail from "./Verify";
import {auth} from "./auth";
import {onAuthStateChanged} from "firebase/auth";
import PrivateRoute from "./PrivateRoute";
import {AuthProvider} from "./AuthContext";
import {Patients} from "./Components/Patients";
import Results from "./Components/Results";
// import Patientres from "./Components/Patientres";
import Patientres from './Components/Patientres';
import UsedDashboard from './Components/useddashboard';
import { db } from './auth';
import { doc } from 'firebase/firestore';



function App() {
    const [currentUser, setCurrentUser] = useState(null)
    const [timeActive, setTimeActive] = useState(false)
    const [role, setRole] = useState('')

    const checkRole = async () => {
      if(currentUser){
        const doc = doc(db, 'patients', currentUser.email)
      
        doc.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setRole("patient")
            } else {
                console.log("No such document!");
                setRole("admin")
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
  
      }
    }
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })
        checkRole();
    }, [])



    
  return (
      <div className="App">
        <Router>
            <AuthProvider value={{currentUser, timeActive, setTimeActive}}>
          <Routes>
            <Route path="/" element={<SignIn />} />

              <Route exact path='/dashboard' element={
                  <PrivateRoute prevRoute = '/dashboard'>
                      <Dashboard/>
                  </PrivateRoute>
              }/>
              <Route exact path='/patients' element={
                  <PrivateRoute prevRoute = '/patients'>
                      <Patients/>
                  </PrivateRoute>
              }/>
              <Route exact path='/results' element={
                  <PrivateRoute prevRoute = '/results'>
                      <Results />
                  </PrivateRoute>
              }/>
              <Route exact path='/useddashboard' element={
                  <PrivateRoute prevRoute = '/useddashboard' role='patient'>
                      <UsedDashboard />
                  </PrivateRoute>
              }/>
               <Route exact path='/patientres' element={
                  <PrivateRoute prevRoute = '/patientres' role='patient'>
                      <Patientres/>
                  </PrivateRoute>
              }/>

            <Route path="/verify-email" element={<VerifyEmail />} />


          </Routes>
            </AuthProvider>
        </Router>
      </div>
  );
}

export default App;
