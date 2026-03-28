import React, { useContext, useRef, useState, useMemo, useEffect } from 'react'
import logo from "../assets/logo.png";
import { Link, useLocation } from 'react-router-dom';
import FinishRide from './FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import { SocketContext } from '../Context/SocketContext';
import useRideRoom from '../Hooks/useRideRoom';
import LiveTracking from '../Components/LiveTracking';

function CaptainRiding() {
  const [isFinishRidePanelOpen, setIsFinishRidePanelOpen] = useState(false);
  const finishRidePanelPef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride
  const { socket } = useContext(SocketContext);
  const status = rideData?.status;
  const currentLocation = rideData?.currentLocation;

  useRideRoom(socket, rideData._id)

  console.log("this is riding page", rideData)

  const pickup = useMemo(() => {
    if (rideData?.pickup?.location?.coordinates) {
      return {
        lat: Number(rideData.pickup.location.coordinates[1]),
        lng: Number(rideData.pickup.location.coordinates[0]),
      };
    }
    return null;
  }, [rideData]);

  useGSAP(() => {
    if (isFinishRidePanelOpen == true) {
      gsap.to(finishRidePanelPef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(finishRidePanelPef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [isFinishRidePanelOpen])

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [])

  return (
    <div className="h-screen overflow-hidden">
      <div className="fixed w-full items-center p-6 top-0 flex justify-between">
        <img className="w-16 " src={logo} alt="" />
        <Link
          to="/home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-4/5 ">
        <LiveTracking rideData={rideData} isCaptain={true} />
      </div>

      <div className="h-1/5 p-6 flex justify-between items-center relative bg-yellow-400">
        {((status === 'accepted' || status === 'ongoing') && currentLocation && pickup) && (
          <h5 onClick={() => { setIsFinishRidePanelOpen(true) }}
            className="text-center w-screen flex text-3xl text-gray-200 justify-center absolute top-0 p-1"
          ><i className=" text-3xl text-gray-950 ri-arrow-up-wide-line"></i></h5>
        )}
        <h4 className='text-xl font-semibold'>4 KM away</h4>
        {((status === 'accepted' || status === 'confirmed') && currentLocation && pickup) && (
          <button onClick={() => { setIsFinishRidePanelOpen(true); }} className=" bg-green-600  text-white font-medium p-3 px-10 rounded-lg transition-colors"
          >Complete Ride</button>
        )}
      </div>

      <>
        <div
          ref={finishRidePanelPef}
          className='fixed z-10 bottom-0 translate-y-full w-full max-h-[90vh] rounded-t-3xl overflow-hidden bg-white shadow-2xl'
        >
          <FinishRide rideData={rideData} setIsFinishRidePanelOpen={setIsFinishRidePanelOpen} />
        </div>
      </>
    </div>
  )
}

export default CaptainRiding