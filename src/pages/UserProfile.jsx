import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api/apiServices";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfile();
        if (!data) throw new Error("Failed to load user profile");
        setProfile(data);
      } catch (err) {
        setError(err.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-4xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-8">User Profile</h2>

        <div className="p-6 rounded-lg bg-[#2c2f33]">
          <p className="text-lg font-semibold text-gray-300">
            Email: <span className="text-[#f97316]">{profile.email}</span>
          </p>
          <p className="text-lg font-semibold text-gray-300 mt-2">
            Role:{" "}
            <span className={profile.isAdmin ? "text-green-400" : "text-blue-400"}>
              {profile.isAdmin ? "Admin" : "User"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
