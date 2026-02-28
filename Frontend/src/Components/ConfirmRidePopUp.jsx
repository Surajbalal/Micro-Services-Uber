import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function ConfirmRidePopUp(props) {
  const [otp, setOtp] = useState('')
  const token = localStorage.getItem('token')
  const navigate = useNavigate();
  
  const submitHandler = async (e) =>{
      e.preventDefault()
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
           params:{ rideId: props.ride._id,
            otp: otp,
          },
          headers: {
              Authorization : `bearer ${token}`
            },
        }
      )
      if(response.status == 200){
         props.setIsConfirmPopUpOpen(false);
         props.setIsRidePopupOpen(false);
         props.setIsRideAccepted(false);
         navigate('/captain-riding',
           {
            state:{ ride:props.ride}
           }
         )
      }
  }
  
  const handleClose = () => {
    props.setIsConfirmPopUpOpen(false);
    // Don't reset ride accepted state - keep the floating button visible
  }
  
  return (
    <div className="p-4 sm:p-6">
      <button 
        onClick={handleClose}
        className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl transition-colors duration-200 focus:outline-none"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </button>

      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 text-center">
        Confirm this ride to Start
      </h3>
      
      <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 bg-gray-50 rounded-lg sm:rounded-xl mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <img 
            className="h-12 w-12 sm:h-14 sm:w-14 object-cover rounded-full border border-gray-300" 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnWUonkf5x2wy51XBChg4J8Ss0hUo0gG2qCg&s" 
            alt="User" 
          />
          <div>
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              {props.ride?.user.fullName.firstName} {props.ride?.user.fullName.lastName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">Customer</p>
          </div>
        </div>
        <div className="text-right">
          <h5 className="text-base sm:text-lg font-semibold text-gray-900">
            {(props.ride?.distance / 1000).toFixed(1)} KM
          </h5>
          <p className="text-xs sm:text-sm text-gray-500">Distance</p>
        </div>
      </div>

      <div className="space-y-1 mb-4 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-100">
          <div className="bg-gray-100 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full shrink-0">
            <i className="text-gray-600 text-sm sm:text-base ri-map-pin-2-fill"></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Pickup</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {props.ride?.pickup.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-100">
          <div className="bg-gray-100 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full shrink-0">
            <i className="text-gray-600 text-sm sm:text-base ri-wallet-2-line"></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">₹{props.ride?.fare}</h3>
            <p className="text-xs sm:text-sm text-gray-500">Cash payment</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
          <div className="bg-gray-100 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full shrink-0">
            <i className="text-gray-600 text-sm sm:text-base ri-map-pin-2-fill"></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Destination</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {props.ride?.destination.address}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <input 
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            className="w-full px-4 py-3 sm:py-4 text-center font-mono text-lg sm:text-xl border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-500 transition-all duration-200" 
            type="text" 
            placeholder="Enter OTP"
            maxLength={6}
            required
          />
        </div>
        
        <div className="flex items-center justify-between w-full gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm sm:text-base"
          >
            Start Ride
          </button>
        </div>
      </form>
    </div>
  )
}

export default ConfirmRidePopUp