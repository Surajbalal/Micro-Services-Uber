import React from 'react'
import { CaptainDataContext } from '../Context/CaptainContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

function CaptainProtectedWrapper({children}) {
    const navigate = useNavigate();
    const [isloading, setIsloading] = useState(true);
    const {captain, setCaptain} = React.useContext(CaptainDataContext);
    const token = localStorage.getItem("captain-token");
    useEffect(() => {
  if (!token) {
    navigate("/captain-login");
    return;
  }

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        setCaptain(response.data.captain);
        setIsloading(false);
      }
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem("captain-token");
      navigate("/captain-login");
    });
}, [token, navigate, setCaptain]);

    
   if(isloading == true){
    return(
        <div>loading... </div>
    )
   }


  return (
    <div>{children}</div>
  )
}

export default CaptainProtectedWrapper