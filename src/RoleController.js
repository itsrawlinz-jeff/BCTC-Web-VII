import React, {createContext, useContext, useState} from 'react'


const AuthContext = createContext()

export function RoleProvider({children}) {
    const [userRole, setUserRole] = useState(null)
    return (
        <AuthContext.Provider value={{userRole, setUserRole}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(RoleProvider)