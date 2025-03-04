import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // Handle password strength dynamically
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 6) {
      setPasswordStrength("❌ Too short");
    } else if (!/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordStrength("⚠ Weak - Add uppercase & number");
    } else {
      setPasswordStrength("✅ Strong");
    }
  };

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      toast.error("Password must contain an uppercase letter and a number.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    toast.info("🔄 Registering, please wait...");

    try {
      const { data } = await API.post("/auth/register", { email, password });
      login(data.user, data.token); // Auto-login user
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000); // Redirect after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-md px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleRegister} className="space-y-6">
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
            onChange={handlePasswordChange}
            required
            className="w-full px-4 py-3 border border-[#4b5563] bg-[#242729] text-white rounded-md focus:ring focus:ring-[#f97316]"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#4b5563] bg-[#242729] text-white rounded-md focus:ring focus:ring-[#f97316]"
          />

          {/* Password Strength Indicator */}
          <p
            className={`text-sm ${
              passwordStrength.includes("✅")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {passwordStrength}
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#f97316] hover:bg-[#ea580c] text-white"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-[#9ca3af] mt-4">
          Already have an account?{" "}
          <span
            className="text-[#f97316] cursor-pointer hover:text-[#ea580c]"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
