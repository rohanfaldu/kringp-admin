import { useNavigate } from "react-router";
export const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const logout = () => {
  const navigate = useNavigate();
  localStorage.clear();
  navigate("/");
};

// Change this from a hook-based function to a regular function
export const authToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "/";
    return null;
  }
  return token;
};