import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { UserDataContext } from "../Context/UserContext";
import axios from 'axios';
function UserSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState({});
  const {user,setUser} = useContext(UserDataContext);
  const navigate = useNavigate();
  const submitHandler = async(e) => {
    e.preventDefault();
    const newUser = {
      fullName: {
        firstName: firstName,
        lastName: lastName,
      },
      email: email,
      password: password,
    };
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser
      
    )
    if(response.status == 201){
      const data = response.data;
      setUser(data.user);
        localStorage.setItem("token", data.token);
      navigate('/home')
    }
console.log(userData);
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="w-16 mx-auto mb-8" src={logo} alt="Uber Logo" />
        <form onSubmit={submitHandler} className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">What's your name?</h3>
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
          <h3 className="text-xl font-semibold text-gray-900">What's your email?</h3>
          <input
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <h3 className="text-xl font-semibold text-gray-900">Enter Password</h3>
          <input
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base placeholder-gray-500 transition-all duration-200"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 text-base"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              Login here
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
  );
}

export default UserSignup;
