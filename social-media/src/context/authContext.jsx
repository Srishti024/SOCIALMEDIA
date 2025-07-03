import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);
  const login = async (inputs) => {
   const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auths/login`, inputs, {
  withCredentials: true,
});
   

    setCurrentUser(res.data)
  };
  const logout=()=>{
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login,logout,setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};