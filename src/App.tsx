import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import UserList from "./pages/Users/Business";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import SignIn from "./pages/AuthPages/SignIn";
import CountryList from "./pages/Country/Country";
import EditCountry from "./pages/Country/edit";  // Add this import
import BusinessList from "./pages/Users/Business";
import InterfaceList from "./pages/Users/Interface";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const tokenExpireTime = localStorage.getItem("tokenExpireTime");
  
  if (!isLoggedIn || (tokenExpireTime && Date.now() > parseInt(tokenExpireTime))) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth Route */}
          <Route path="/" element={<SignIn />} />

          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/country" element={<CountryList />} />
            <Route path="/country/detail" element={<EditCountry />} />  {/* Add this route */}
            <Route path="/user/business" element={<BusinessList />} />  {/* Add this route */}
            <Route path="/user/influencer" element={<InterfaceList />} />  {/* Add this route */}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
