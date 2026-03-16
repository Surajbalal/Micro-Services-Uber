import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { CaptainDataContext } from "../Context/CaptainContext";
import axios from "axios";
function CaptainSignup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userData, setUserData] = useState({})
    const [vehicleColor, setVehicleColor] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");
    const [vehicleCapacity, setVehicleCapacity] = useState("");
    const [vehicleType, setVehicleType] = useState("");

const navigate = useNavigate();
    const {captain, setcaptain} = React.useContext(CaptainDataContext);
    const submitHandler = async (e) => {
      e.preventDefault();
      const newUser = {
        fullName: {
          firstName: firstName,
          lastName: lastName,
        },
        email: email,
        password: password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType: vehicleType,
        },
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/register`,newUser)
      if(response.status == 201){
    const data = response.data;
    setUserData(data.captain);
    localStorage.setItem("captain-token",data.token);
        alert("Captain registered successfully");
        navigate("/captain-home");
      }
  console.log(userData);
  setcaptain(userData)
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setVehicleType("");
    };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="w-16 mx-auto mb-8" src={logo} alt="Uber Logo" />
        <form onSubmit={submitHandler} className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Captain's Name</h3>
          <div className="flex gap-4">
            <input
              required
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
            <input
              required
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Captain's Email</h3>
          <input
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <h3 className="text-xl font-semibold text-gray-900">Password</h3>
          <input
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <h3 className="text-xl font-semibold text-gray-900">Vehicle Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => {
                if (e.target.value < 0) {
                  setVehicleCapacity(0);
                } else {
                  setVehicleCapacity(e.target.value);
                }
              }}
              min="0"
            />
            <select
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base text-gray-700 transition-all duration-200"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 text-base"
          >
            Create Captain Account
          </button>
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/captain-login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-xs text-gray-500 leading-tight text-center">
          This site is protected by reCAPTCHA and the{' '}
          <span className="underline hover:text-gray-700 transition-colors duration-200">Google Privacy Policy</span>
          {' '}and{' '}
          <span className="underline hover:text-gray-700 transition-colors duration-200">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  )
}

export default CaptainSignup

