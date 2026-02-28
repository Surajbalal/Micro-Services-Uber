import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../Context/SocketContext';
import LiveTracking from '../Components/LiveTracking';
import useRideRoom from '../Hooks/useRideRoom';
function Riding() {
  const location = useLocation();
  const rideData = location.state?.ride;
  const {socket, receiveMessage} = useContext(SocketContext);
  const navigate = useNavigate();
  useEffect(() => {
  const cleanup = receiveMessage('ride-ended', () => {
    navigate('/home');
  });

  return cleanup; 
}, [socket]);
console.log("this is ride datat ",rideData);
  useRideRoom(socket,rideData._id)




  return (
    <div className='h-screen'>
        <Link to="/home" className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i className="text-lg font-medium ri-home-5-line"></i>
        </Link>
        <div className='h-1/2'>
             <LiveTracking rideData={rideData}/>

        </div>
        <div className='h-1/2 p-4'>
         <div className='flex item-center justify-between'>
        <img
          className=" h-12"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt=""
        />
        <div className='text-right'>
            <h2 className='text-lg font-medium'>{rideData?.captain.fullName.firstName}</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>{rideData?.captain.vehicle.plate}</h4>
            <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
        </div>
      </div>
     
      <div className="flex gap-2 flex-col justify-between items-center  ">
        <div className="w-full mt-5">

            <div className="flex item-center gap-5 p-3 border-gray-300 border-b-2">
              <i className=" text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">432/22-B</h3>
                <p className="text-sm -mt-1 text-gray-600">
                 {rideData?.destination?.address}
                </p>
              </div>
            </div>
            <div className="flex item-center gap-5 border-gray-300 p-3 ">
              <i className="ri-wallet-2-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{rideData?.fare}</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
           
          </div>
      </div>

    <button className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">Make a Payment</button>
        </div>
    </div>
  )
}

export default Riding