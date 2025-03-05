import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadProducts } from "../store/productSlice";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Fix refresh issue

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-6xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-8">
          Product Listings
        </h2>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-[#242729] p-6 rounded-lg shadow-md border border-[#2c2f33] animate-pulse"
              >
                <div className="w-full h-48 bg-gray-700 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-600 w-3/4 mb-2 rounded"></div>
                <div className="h-4 bg-gray-600 w-1/2 mb-2 rounded"></div>
                <div className="h-6 bg-gray-600 w-1/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#242729] p-6 rounded-lg shadow-md border border-[#2c2f33] hover:shadow-lg transition transform hover:scale-105"
              >
                <img
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                <h3 className="text-xl font-semibold text-[#e5e7eb] mb-2">
                  {product.name}
                </h3>
                <p className="text-[#9ca3af] text-sm mb-2">
                  {product.category || "Uncategorized"}
                </p>
                <p className="text-[#f97316] text-lg font-bold">
                  ${product.price?.toFixed(2) || "0.00"}
                </p>

                {/* Fix "View Details" refresh issue */}
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="block w-full mt-4 text-center bg-[#f97316] text-white py-2 rounded-md hover:bg-[#ea580c] transition font-semibold"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
