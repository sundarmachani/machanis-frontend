import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { startCheckout } from "../api/apiServices";

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const validItems = items.map((item) => ({
        productId: item.productId?._id,
        name: item.productId?.name || "Unknown",
        price: Number(item.productId?.price),
        quantity: item.quantity || 1,
        image: item.productId?.image || "",
      }));

      if (validItems.length === 0) {
        throw new Error("Invalid cart items. Please refresh your cart.");
      }

      const paymentUrl = await startCheckout(validItems, user?.id);
      if (paymentUrl) {
        sessionStorage.setItem("cart", JSON.stringify([])); // Optional
        window.location.href = paymentUrl;
      } else {
        throw new Error("Payment failed. Try again.");
      }
    } catch (error) {
      setError(error.message || "Payment failed. Please try again.");
      navigate("/failure");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
        <div className="w-full max-w-4xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33] text-center">
          <h2 className="text-4xl font-bold text-center mb-8">Checkout</h2>
          <p className="text-[#9ca3af] text-lg">
            Please{" "}
            <span
              className="text-[#f97316] cursor-pointer hover:text-[#ea580c]"
              onClick={() => navigate("/login")}
            >
              log in
            </span>{" "}
            to proceed with checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-4xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-8">Checkout</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {items.length === 0 ? (
          <p className="text-center text-[#9ca3af] text-lg">
            Your cart is empty.
          </p>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-6 text-[#e5e7eb]">
              Order Summary
            </h3>

            {items.map((item) => (
              <div
                key={item.productId?._id}
                className="flex justify-between items-center mb-5 border-b border-[#4b5563] pb-5"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.productId?.image || "https://via.placeholder.com/100"
                    }
                    alt={item.productId?.name || "Unknown Product"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <span className="text-[#e5e7eb] text-lg">
                      {item.productId?.name || "Unknown"} x {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="text-[#f97316] text-lg">
                  ${(item.productId?.price * item.quantity || 0).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="text-2xl font-semibold mt-6 text-[#e5e7eb]">
              Total:{" "}
              <span className="text-[#f97316]">${totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={items.length === 0 || loading}
              className={`w-full py-4 mt-6 rounded-lg text-lg font-semibold transition ${
                items.length === 0 || loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#f97316] hover:bg-[#ea580c] text-white"
              }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
