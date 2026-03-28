import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import CaptainDetails from "../Components/CaptainDetails";
import RidePopUp from "../Components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../Components/ConfirmRidePopUp";
import { SocketContext } from "../Context/SocketContext";
import { CaptainDataContext } from "../Context/CaptainContext";
import LiveTracking from "../Components/LiveTracking";
import axios from "axios";

function CaptainHome() {
  const [captainLocation, setCaptainLocation] = useState(null);
  const [homeLocation, setHomeLocation] = useState(null);
  const [ride, setRide] = useState(null);
  const [isRidePopupOpen, setIsRidePopupOpen] = useState(false);
  const [isConfirmPopUpOpen, setIsConfirmPopUpOpen] = useState(false);
  const [isRideAccepted, setIsRideAccepted] = useState(false);
  const confirmPopupPanelRef = useRef(null);
  const ridePopupPanelRef = useRef(null);
  const {sendMessage, socket} = useContext(SocketContext)
  const {captain} = useContext(CaptainDataContext);

  const token = localStorage.getItem('captain-token');

  const [isAcceptingRide, setIsAcceptingRide] = useState(false);

const confirm = async()=>{
  try {
    setIsAcceptingRide(true);
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId : ride._id,
        captainId : captain._id ,
      },
        {  headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
  if(response.status == 200){
    setIsRidePopupOpen(false);
    setIsConfirmPopUpOpen(true);
    setIsRideAccepted(true);
  }
  } catch (error) {
    console.error("Error accepting ride:", error);
    alert(error.response?.data?.message || "Failed to accept ride.");
  } finally {
    setIsAcceptingRide(false);
  }
}



useEffect(() => {
  if (!captain || !sendMessage) return;

  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }

  const interval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCaptainLocation(location);

        sendMessage("update-captain-location", {
          captainId: captain._id,
          location,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, 10000);

  return () => clearInterval(interval);
}, [captain?._id, sendMessage]);
useEffect(() => {
  if (!socket) return;

  socket.on("new-ride", (data) => {
    setRide({
       ...data.ride,
      user: data.user,
    }
    );
    setIsRidePopupOpen(true);
    console.log("New ride recieve:", ride);
  });

  return () => {
    socket.off("new-ride");
  };
}, [socket]);
useEffect(() => {
  console.log("SOCKET VALUE:", socket);
}, [socket]);

useEffect(()=>{
    console.log(captain);
 sendMessage("join",{userType:"captain",userId: captain._id })
},[captain])
   useGSAP(() => {
    // Initialize panels in hidden state
    gsap.set(ridePopupPanelRef.current, { y: "100%" });
    gsap.set(confirmPopupPanelRef.current, { y: "100%" });
  }, []);

  useGSAP(() => {
    if (isRidePopupOpen) {
      gsap.to(ridePopupPanelRef.current, {
        y: "0%",
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        y: "100%",
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isRidePopupOpen]);
  useGSAP(() => {
    if (isConfirmPopUpOpen) {
      gsap.to(confirmPopupPanelRef.current, {
        y: "0%",
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(confirmPopupPanelRef.current, {
        y: "100%",
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isConfirmPopUpOpen]);
  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden">
      {/* Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img className="w-10 sm:w-12 lg:w-16" src={logo} alt="Uber Logo" />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Captain Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <i className="ri-notification-3-line"></i>
                <span>Notifications</span>
              </button>
              <Link
                to="/home"
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                title="Switch to User"
              >
                <i className="text-lg font-medium ri-user-3-line text-gray-700"></i>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="h-full pt-16 sm:pt-20">
        <div className="h-full flex flex-col">
          {/* Map Section */}
          <div className="flex-1 relative">
            <LiveTracking rideData={ride} isCaptain={true} />
            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {ride ? 
                        ride.status === 'accepted' ? 'Heading to pickup' : 
                        ride.status === 'started' ? 'En route to destination' : 
                        'Online'
                      : 'Online'
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-map-pin-line"></i>
                    <span>
                      {ride ? 
                        ride.status === 'accepted' ? 'Pickup location' : 
                        ride.status === 'started' ? 'Destination' : 
                        'Ready for rides'
                      : 'Ready for rides'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Captain Details Section */}
          <div className="bg-white border-t border-gray-100">
            <CaptainDetails />
          </div>
        </div>
      </div>

      <div 
        ref={ridePopupPanelRef} 
        className="fixed z-50 bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl"
      >
        <RidePopUp 
          ride={ride} 
          confirm={confirm}
          isAcceptingRide={isAcceptingRide}
          setIsRidePopupOpen={setIsRidePopupOpen} 
          setIsConfirmPopUpOpen={setIsConfirmPopUpOpen}
        />
      </div>
      
      <div 
        ref={confirmPopupPanelRef} 
        className="fixed z-50 bottom-0 left-0 right-0 h-screen bg-white"
      >
        <ConfirmRidePopUp 
          ride={ride} 
          setIsRidePopupOpen={setIsRidePopupOpen} 
          setIsConfirmPopUpOpen={setIsConfirmPopUpOpen}
          setIsRideAccepted={setIsRideAccepted}
        />
      </div>
      
      {/* Floating button for accepted rides */}
      {isRideAccepted && !isConfirmPopUpOpen && (
        <button
          onClick={() => setIsConfirmPopUpOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 hover:scale-105"
          title="Show OTP"
        >
          <i className="ri-key-2-fill text-xl"></i>
        </button>
      )}
    </div>
  );
}

export default CaptainHome;
