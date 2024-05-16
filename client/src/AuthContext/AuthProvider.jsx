// AuthContext.js
import  { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';
import {   getCurrentUser, logoutUser } from '../api/api';
import { CircularProgress } from '@mui/material';
const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    setUserLoading(true);
    const fetchCurrentUser = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if(user){
          setUser(user);
          setUnreadNotificationsCount(user.unread_notifications);
        }
        
      } catch (error) {
        //  console.log()
      }finally{
        setLoading(false);
      }
    }
    
    fetchCurrentUser();
    setUserLoading(false);
}, []);

  // useEffect(()=>{

    // const updateCertifications = async()=>{
    //   const updatedUser= await addcertification(user);
    //   updateUser(updatedUser);
    // };
    // updateCertifications();
  // },[user])

 

  const logout = () => {
    setLoading(true);
    const LoggingOut= async()=>{
      await logoutUser();
    }
    if(user){
      LoggingOut();
      setUser(null);

    }
    setLoading(false);
  };


  return (
    <AuthContext.Provider value={{ user, loading,  logout, userLoading, setUser, unreadNotificationsCount, setUnreadNotificationsCount }}>
        {loading ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background
          }}
        >
          <CircularProgress color="inherit" />
        </div>
        )
      :children
    }
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
