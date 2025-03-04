import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api";
import { confirmPayment } from "../api/apiServices";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Invalid payment session.");
      setLoading(false);
      return;
    }

    const confirmOrder = async () => {
      confirmPayment(sessionId)
        .then((data) => {
          if (data.success) {
            sessionStorage.setItem("cart", JSON.stringify([]));
            setTimeout(() => navigate("/dashboard"), 3000);
          } else {
            setError("Failed to confirm payment.");
          }
        })

        .catch((error) => console.error("Error confirming payment:", error));
      setLoading(false);
    };

    confirmOrder();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-4xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33] text-center">
        <h2
          className={`text-4xl font-bold text-center mb-8 ${
            loading
              ? "text-yellow-400"
              : error
              ? "text-red-500"
              : "text-green-400"
          }`}
        >
          {loading
            ? "Processing Payment..."
            : error
            ? "Payment Failed"
            : "Payment Successful!"}
        </h2>

        {error ? (
          <p className="text-red-400 bg-red-900 px-4 py-2 rounded-md inline-block">
            {error}
          </p>
        ) : (
          <p className="text-[#9ca3af] text-lg bg-green-900 text-green-400 px-4 py-2 rounded-md inline-block">
            Redirecting to Dashboard...
          </p>
        )}

        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-6">
            <svg
              className="w-16 h-16 text-green-400 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
