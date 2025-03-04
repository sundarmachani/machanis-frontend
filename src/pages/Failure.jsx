import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-4xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33] text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-8">Payment Failed</h2>
        <p className="text-[#9ca3af] text-lg">
          Something went wrong. Please try again.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Failure;
