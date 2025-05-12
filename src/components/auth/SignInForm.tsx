import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { FetchData } from "../../utils/FetchData";
import { AutUserResponse } from "../../Types/User";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields", {
          style: {
            backgroundColor: "#FEF2F2",
            color: "#991B1B"
          }
        });
        return;
      }
    
      const userPerameter = {
        emailAddress: formData.email,
        password: formData.password,
        fcmToken: "FCM1458746"
      };
      const result = await FetchData<AutUserResponse>( '/user/login', 'POST', userPerameter); 
      if(result.status){
        const userData = result.data;
        const token = userData.token;
        const expireTime = Date.now() + 24 * 60 * 60 * 1000;

        localStorage.setItem("authToken", token);
        localStorage.setItem("tokenExpireTime", expireTime.toString());
        localStorage.setItem("isLoggedIn", "true");
        // Instead of this:
        // localStorage.setItem("userInfo", JSON.parse(JSON.stringify(userData)));
        
        // Do this:
        localStorage.setItem("userInfo", JSON.stringify(userData));

        toast.success("Login successful!", {
          style: {
            backgroundColor: "#F0FDF4",
            color: "#166534"
          }
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }else{
        toast.error("Invalid email or password", {
          style: {
            backgroundColor: "#FEF2F2",
            color: "#991B1B"
          }
        });
      }  
    } catch (error) {
      toast.error("API calling Issue", {
        style: {
          backgroundColor: "#FEF2F2",
          color: "#991B1B"
        }
      });
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md lg:max-w-lg lg:w-[450px]">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Logo and Title */}
          <div className="mb-6 text-center">
            <img
              src="/images/logo/logo.svg"
              alt="Logo"
              className="w-35 h-15 mx-auto mb-4"
            />
          </div>
          {/* Form Section */}
          <div className="w-full">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign in!
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>Email <span className="text-error-500">*</span></Label>
                  <Input 
                    placeholder="info@gmail.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Password <span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={formData.rememberMe} 
                      onChange={(checked) => setFormData({ ...formData, rememberMe: checked })}
                    />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        closeButton={false}
        style={{ width: "auto" }}
        toastStyle={{
          padding: "16px",
          margin: "8px 0",
          borderRadius: "8px",
          boxShadow: "none",
          minHeight: "auto"
        }}
      />
    </div>
  );
}
