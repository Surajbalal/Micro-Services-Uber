import React from 'react'

function WaitingForDriver(props) {
  console.log("this is inside waiting ", props.socket)
  
  const handleClose = () => {
    props.setIsDriverWaitingOpen(false);
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
        Driver on the way!
      </h3>
      
      <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 bg-gray-50 rounded-lg sm:rounded-xl mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full border border-gray-300"
            src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
            alt="Driver"
          />
          <div>
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              {props.rideData.captain?.fullName.firstName} {props.rideData.captain?.fullName.lastName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">Your Captain</p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900">
            {props.rideData.captain?.vehicle.plate}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500">{props.rideData.captain?.vehicle.vehicleType?.toUpperCase()}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
        <p className="text-sm sm:text-base text-gray-500 mb-2">Your OTP is</p>
        <div className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-widest">
          {props.rideData?.otp}
        </div>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">Share this OTP with your driver</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-100">
          <div className="bg-gray-100 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full shrink-0">
            <i className="text-gray-600 text-sm sm:text-base ri-map-pin-2-fill"></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">Pickup</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {props.rideData?.pickup?.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-100">
          <div className="bg-gray-100 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full shrink-0">
            <i className="text-gray-600 text-sm sm:text-base ri-wallet-2-line"></i>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">₹{props.rideData?.fare}</h3>
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
              {props.rideData?.destination?.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver