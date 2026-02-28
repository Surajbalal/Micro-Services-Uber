import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function UserLogout() {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const logout = async ()=>{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/logout`,{
            headers:{

                Authentication : `bearer ${token}`,
            }
        }).then((response)=>{
            if(response.status == 200){
                localStorage.removeItem('token');
                navigate('/login');
            }
        
        })
    }
useEffect(()=>{
    logout();
},[])
  return (
    <div>
        userLogout
    </div>
  )
}

export default UserLogout