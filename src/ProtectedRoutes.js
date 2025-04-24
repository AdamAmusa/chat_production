import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context";

export function ProtectedRoutes({ children }){
    const { currentUser } = useContext(AuthContext);
   if (!currentUser) {
       return <Navigate to="/login" />;
   }
   else{
    return children;
}
}