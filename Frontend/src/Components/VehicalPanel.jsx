import React from 'react'

function VehicalPanel(props) {
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <button
        onClick={() => props.setIsVehicalPanelOpen(false)}
        className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl transition-colors duration-200 focus:outline-none"
      >
        <i className="ri-arrow-down-wide-line"></i>
      </button>
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Choose a Vehicle</h3>
      
      <div
        onClick={() => {
          props.setVehicleType("car");
          props.setIsConfirmRidePanelOpen(true);
        }}
        className="flex items-center w-full p-3 sm:p-4 mb-2 sm:mb-3 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-black hover:bg-gray-50 cursor-pointer transition-all duration-200 active:scale-98"
      >
        <img className="h-10 sm:h-12 lg:h-14 object-contain" src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="UberGo" />
        <div className="flex-1 ml-3 sm:ml-4">
          <h4 className="font-medium text-sm sm:text-base text-gray-900">
            UberGo <span className="text-gray-600"><i className="ri-user-3-fill"></i>4</span>
          </h4>
          <h5 className="font-medium text-xs sm:text-sm text-gray-700">2 mins away</h5>
          <p className="font-normal text-xs text-gray-500">Affordable, compact rides</p>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">₹{props.fare.car}</h2>
      </div>
      
      <div
        onClick={() => {
          props.setVehicleType("motorcycle");
          props.setIsConfirmRidePanelOpen(true);
        }}
        className="flex items-center w-full p-3 sm:p-4 mb-2 sm:mb-3 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-black hover:bg-gray-50 cursor-pointer transition-all duration-200 active:scale-98"
      >
        <img className="h-10 sm:h-12 lg:h-14 object-contain" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTRjYjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n" alt="Moto" />
        <div className="flex-1 ml-3 sm:ml-4">
          <h4 className="font-medium text-sm sm:text-base text-gray-900">
            Moto <span className="text-gray-600"><i className="ri-user-3-fill"></i>1</span>
          </h4>
          <h5 className="font-medium text-xs sm:text-sm text-gray-700">4 mins away</h5>
          <p className="font-normal text-xs text-gray-500">Affordable motorcycle rides</p>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">₹{props.fare.motorcycle}</h2>
      </div>
      
      <div
        onClick={() => {
          props.setVehicleType("auto");
          props.setIsConfirmRidePanelOpen(true);
        }}
        className="flex items-center w-full p-3 sm:p-4 mb-2 sm:mb-3 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-black hover:bg-gray-50 cursor-pointer transition-all duration-200 active:scale-98"
      >
        <img className="h-10 sm:h-12 lg:h-14 object-contain" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n" alt="UberAuto" />
        <div className="flex-1 ml-3 sm:ml-4">
          <h4 className="font-medium text-sm sm:text-base text-gray-900">
            UberAuto <span className="text-gray-600"><i className="ri-user-3-fill"></i>3</span>
          </h4>
          <h5 className="font-medium text-xs sm:text-sm text-gray-700">4 mins away</h5>
          <p className="font-normal text-xs text-gray-500">Affordable auto rides</p>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">₹{props.fare.auto}</h2>
      </div>
    </div>
  )
}

export default VehicalPanel