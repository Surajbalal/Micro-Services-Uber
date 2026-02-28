import React from 'react'

function LookingForDriver(props) {
  return (
    <div className="p-6">
      <button
        onClick={() => {
          props.setIsVehicleSearchOpen(false);
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 focus:outline-none"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </button>
      <h3 className="text-2xl font-bold mb-6 text-gray-900 text-center">Looking for a Driver</h3>
      <div className="flex flex-col items-center mt-6">
        <img
          className="h-20 object-contain mb-6"
          src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
          alt="Looking for driver"
        />
        <div className="w-full space-y-1">
          <div className="flex items-center gap-4 p-4 border-b border-gray-200">
            <i className="text-xl text-gray-600 ri-map-pin-2-fill"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Pickup</h3>
              <p className="text-sm text-gray-600 mt-1">
                {props.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border-b border-gray-200">
            <i className="text-xl text-gray-600 ri-map-pin-2-fill"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Destination</h3>
              <p className="text-sm text-gray-600 mt-1">
                {props.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <i className="text-xl text-gray-600 ri-wallet-2-line"></i>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">₹{props.fare[props.vehicleType]}</h3>
              <p className="text-sm text-gray-600 mt-1">Cash payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LookingForDriver