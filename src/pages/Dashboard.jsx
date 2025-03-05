import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUserOrders } from "../store/orderSlice";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(loadUserOrders());
    }
  }, [user, dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-400 bg-orange-800";
      case "Paid":
        return "text-yellow-400 bg-yellow-800";
      case "Shipped":
        return "text-blue-400 bg-blue-800";
      case "Delivered":
        return "text-green-400 bg-green-800";
      case "Cancelled":
        return "text-red-400 bg-red-800";
      default:
        return "text-gray-400 bg-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
        <div className="w-full max-w-6xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33] text-center">
          <h2 className="text-4xl font-bold text-center mb-8">My Orders</h2>
          <p className="text-[#9ca3af] text-lg">
            Please{" "}
            <span
              className="text-[#f97316] cursor-pointer hover:text-[#ea580c]"
              onClick={() => navigate("/login")}
            >
              log in
            </span>{" "}
            to view your orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-6xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-8">My Orders</h2>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p className="text-center text-[#9ca3af] text-lg">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="text-center text-[#9ca3af] text-lg">
            No orders found.{" "}
            <Link to="/" className="text-[#f97316] hover:text-[#ea580c]">
              Start shopping
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#242729] p-6 rounded-lg shadow-md border border-[#2c2f33]"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Order ID: <span className="text-[#f97316]">{order._id}</span>
                </h3>
                <p
                  className={`inline-block px-3 py-1 rounded-md font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </p>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Items:</h4>
                  <ul className="mt-2 space-y-2">
                    {order.items?.length > 0 ? (
                      order.items.map((item, index) => (
                        <li
                          key={`${
                            item.productId?._id - index || Math.random()
                          }`}
                          className="flex items-center justify-between border-b border-[#4b5563] pb-2"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={
                                item.productId?.image ||
                                "https://via.placeholder.com/100"
                              }
                              alt={item.productId?.name || "Unknown Product"}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <span>
                              {item.productId?.name || "Unknown Product"} x{" "}
                              {item.quantity}
                            </span>
                          </div>
                          <span className="text-[#f97316]">
                            $
                            {(
                              item.productId?.price * item.quantity || 0
                            ).toFixed(2)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p className="text-[#9ca3af]">No items in this order.</p>
                    )}
                  </ul>
                </div>

                <div className="text-lg font-semibold mt-4 text-[#e5e7eb]">
                  Total:{" "}
                  <span className="text-[#f97316]">
                    ${order.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
