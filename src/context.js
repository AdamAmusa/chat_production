import { createContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        onAuthStateChanged(auth, (user) =>{
            setCurrentUser(user);
        });
    }, []);

    return(
    <AuthContext.Provider value={{currentUser}}>
        {children}
    </AuthContext.Provider> 
    )
};