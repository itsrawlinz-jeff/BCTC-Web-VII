import {Navigate} from 'react-router-dom'
import {useAuthValue} from './AuthContext'

export default function PrivateRoute({children, prevRoute, role}) {
    const {currentUser} = useAuthValue()

    if(!currentUser?.emailVerified){
        return <Navigate to={prevRoute} replace/>
    }

    // if(role === 'patient' && prevRoute === '/useddashboard'){
    //     return <Navigate to='/useddashboard' replace/>
    // } else if (role !== currentUser.role)
    // {
    //     return <Navigate to={prevRoute} replace/>
    // }


    return children
}