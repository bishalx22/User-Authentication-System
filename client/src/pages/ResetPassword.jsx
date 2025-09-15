import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const ResetPassword = () => {

  axios.defaults.withCredentials = true
  const { backendUrl } = useContext(AppContext)

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = async (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlekeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      if (data.success) {
        toast.success(data.message)
        setIsEmailSent(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }
    //   e.preventDefault();
    //   const otpArray = inputRefs.current.map(e => e.value);
    //   const joinedOtp = otpArray.join('');
    //   setOtp(joinedOtp);
    //   setIsOtpSubmitted(true);

    //   try {
    //     const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp', { otp: joinedOtp });

    //     if (data.success) {
    //       toast.success(data.message);
    //     } else {
    //       toast.error(data.message);
    //     }
    //   } catch (error) {
    //     toast.error(error.message);
    //   }
    // }

    const onSubmitNewPassword = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
        if (data.success) {
          toast.success(data.message)
          navigate('/login')
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }


    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
          className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        />

        {/* Enter email id */}
        {!isEmailSent && (
          <form
            onSubmit={onSubmitEmail}
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
            <h1 className="text-center text-2xl font-semibold text-white mb-4">
              Reset password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter your registered email address
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img className="w-3 h-3" src={assets.mail_icon} alt="" />
              <input
                className="bg-transparent outline-none w-full text-white"
                type="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer">
              Submit
            </button>
          </form>
        )}
        {/* OTP input form */}

        {!isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitOtp}
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Reset password OTP
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter the 6-digit code sent to your email id.
            </p>
            <div onPaste={handlePaste} className="flex justify-between mb-8">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handlekeyDown(e, index)}
                    className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                  />
                ))}
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white cursor-pointer">
              Submit
            </button>
          </form>
        )}

        {/* enter new password */}
        {isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitNewPassword}
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
            <h1 className="text-center text-2xl font-semibold text-white mb-4">
              New password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter the new password below
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img className="w-3 h-3" src={assets.lock_icon} alt="" />
              <input
                className="bg-transparent outline-none w-full text-white"
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer">
              Submit
            </button>
          </form>
        )}
      </div>
    );
  };

  export default ResetPassword;
