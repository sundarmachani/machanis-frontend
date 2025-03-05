import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadCart, removeItem, restoreItem } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  useEffect(() => {
    if (user) dispatch(loadCart());
  }, [user, dispatch]);

  const handleRemove = (productId, productName) => {
    const removedItem = items.find((item) => item.productId._id === productId);
    dispatch(removeItem(productId));

    let undoClicked = false;

    const undoToast = toast(
      <div>
        <p>🚀 "{productName}" removed from cart.</p>
        <button
          onClick={() => {
            undoClicked = true;
            clearTimeout(undoTimeout);
            dispatch(restoreItem(removedItem));
            toast.dismiss(undoToast);
            toast.success(`"${productName}" has been restored.`);
          }}
          className="bg-green-500 text-white px-3 py-1 rounded ml-2 hover:bg-green-600 transition"
        >
          Undo
        </button>
      </div>,
      { autoClose: 5000, closeOnClick: false }
    );

    const undoTimeout = setTimeout(() => {
      if (!undoClicked) {
        toast.success(`"${productName}" has been permanently removed.`);
      }
    }, 5000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
        <div className="w-full max-w-4xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33] text-center">
          <h2 className="text-4xl font-bold text-center mb-8">Shopping Cart</h2>
          <p className="text-[#9ca3af] text-lg">
            Please{" "}
            <span
              className="text-[#f97316] cursor-pointer hover:text-[#ea580c]"
              onClick={() => navigate("/login")}
            >
              log in
            </span>{" "}
            to view your cart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-4xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-8">Shopping Cart</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading ? (
          <p className="text-center text-[#9ca3af]">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-[#9ca3af] text-lg">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div>
              {items.map((item) => (
                <div
                  key={item.productId?._id}
                  className="flex justify-between items-center mb-6 border-b border-[#4b5563] pb-6"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <img
                      src={
                        item.productId?.image ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.productId?.name || "Unknown Product"}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {item.productId?.name || "Unknown Product"}
                      </h3>
                      <p className="text-[#f97316] text-lg">
                        $
                        {((item.productId?.price || 0) * item.quantity).toFixed(
                          2
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleRemove(item.productId?._id, item.productId?.name)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <div className="text-2xl font-semibold text-right text-[#e5e7eb] mt-6">
              Total:{" "}
              <span className="text-[#f97316]">${totalAmount.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => items.length > 0 && navigate("/checkout")}
                className={`w-full py-4 rounded-lg text-lg font-semibold transition ${
                  items.length === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#f97316] hover:bg-[#ea580c] text-white"
                }`}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
