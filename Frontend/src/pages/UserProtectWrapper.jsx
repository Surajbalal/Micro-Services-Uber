import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../Context/UserContext';
import { useContext } from 'react';
import axios from 'axios';

function UserProtectWrapper({children}) {
    const navigate = useNavigate();
    const {user,setUser} = useContext(  UserDataContext);
    const token = localStorage.getItem('token');
   useEffect(()=>{
     if(!token){
        navigate('/login');
         return; 
    }
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        setUser((response.data));
        
        console.log("this is calling from user protected wrapper",user)

      }
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem("token");
      navigate("/login");
    });
}, [token ,navigate, setUser]);
  return (
    <div>{children}</div>
  )
}

export default UserProtectWrapper