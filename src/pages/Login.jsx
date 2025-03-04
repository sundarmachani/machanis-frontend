import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Email and password are required.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    toast.info("Logging in, please wait...", { autoClose: 2000 });

    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data.user, data.token); // Store in AuthContext
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000); // Delay for smoother transition
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-md px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#4b5563] bg-[#242729] text-white rounded-md focus:ring focus:ring-[#f97316]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#4b5563] bg-[#242729] text-white rounded-md focus:ring focus:ring-[#f97316]"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#f97316] hover:bg-[#ea580c] text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-[#9ca3af] mt-4">
          <p>
            Don't have an account?{" "}
            <span
              className="text-[#f97316] cursor-pointer hover:text-[#ea580c]"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
          <p className="mt-2">
            <span
              className="text-[#f97316] cursor-pointer hover:text-[#ea580c]"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
