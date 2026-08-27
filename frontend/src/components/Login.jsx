import React from "react";
import { MdAlternateEmail } from "react-icons/md";
import {
  IoLockClosedOutline,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";
import axios from "axios";

const Login = (props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const handleLogin = async () => {
    try {
      const data = {
        email: email,
        password: password,
      };
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        data
      );
      props.setToken(response.data.access_token);
      props.setTokenType(response.data.token_type);
      props.setRefreshToken(response.data.refresh_token);
      props.setIsLoggedIn(true);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      props.handleAlert("Logged in Successfully!", "success");
      setEmail("");
      setPassword("");
      props.setSignup(false);
      props.setLogout(false);
    } catch (error) {
      props.handleAlert("Invalid credentials!", "error");
      console.error("Error logging in:", error);
    }
  };
  return (
   <div className="w-screen h-screen flex gap-10 justify-between items-center text-white">
         <div className="txt text-6xl  flex flex-col justify-center items-center w-[40%] h-full bg-white text-black gap-2">
           <span className="custom-kaushan">Nowted</span>
           <span className="text-lg">Notes, Just Smarter.</span>
           <span className="text-lg underline-offset-2 underline cursor-pointer"
           onClick={() => props.setSignup(true)}
           >New to Nowted?</span>
         </div>
         <div className="login h-[90%] w-[45%] flex flex-col justify-center  items-center gap-5 mx-auto p-20 pt-10 rounded-2xl">
           <div className="create w-full  flex justify-between items-center mb-5">
             <span className="text-4xl w-full flex justify-center">Login</span>
           </div>
   
           
           <div className="email flex flex-col gap-2 w-full">
             <div className="input w-full border h-[6vh] flex justify-center items-center">
               <MdAlternateEmail className="text-xl m-2" />
               <input
                 type="text"
                 className="h-full w-full focus:outline-0 text-xl"
                 placeholder="Email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
             </div>
           </div>
           <div className="password flex flex-col gap-2 w-full">
             <div className="input w-full border h-[6vh] flex justify-center items-center">
               <IoLockClosedOutline className="text-xl m-2" />
               <input
                 type={`${showPassword ? "text" : "password"}`}
                 className="h-full w-full focus:outline-0 text-xl"
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
               {showPassword ? (
                 <IoEyeOutline
                   className="text-2xl mr-2 cursor-pointer opacity-50 hover:opacity-100"
                   onClick={() => setShowPassword(false)}
                 />
               ) : (
                 <IoEyeOffOutline
                   className="text-2xl mr-2 cursor-pointer opacity-50 hover:opacity-100"
                   onClick={() => setShowPassword(true)}
                 />
               )}
             </div>
           </div>
           
           <div className="submit">
             <button
               className="w-[20vw] h-[6vh] bg-white flex justify-center items-center text-black text-xl font-medium cursor-pointer hover:bg-gray-200"
               onClick={handleLogin}
             >
               Login
             </button>
           </div>
         </div>
       </div>
  );
};

export default Login;
