import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import UserProfile from "./pages/UserProfile";


// Wait for auth state to load before checking access
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="text-center text-gray-400">Loading...</p>; // Prevent redirect loop
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  return user?.isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/success" element={<Success />} />
        <Route path="/failure" element={<Failure />} />
        <Route path="/profile" element={<UserProfile />} />;
      </Routes>
    </div>
  );
}

export default App;
