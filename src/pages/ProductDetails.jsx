import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProductById,
  updateProduct,
  deleteProduct,
  addToCart,
} from "../api/apiServices";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    stock: 0,
  });

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        if (!data) throw new Error("Product not found");

        setProduct(data);
        setUpdatedProduct({
          name: data.name || "",
          description: data.description || "",
          price: data.price || 0,
          image: data.image || "",
          stock: data.stock || 0,
        });
      } catch (err) {
        setError("Failed to load product details.");
      }
      setLoading(false);
    };

    getProduct();
  }, [id, user]);

  // Handle Delete Product with Toaster Notification
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
      navigate("/"); // Redirect back to home
    } catch (err) {
      toast.error("Failed to delete product.");
    }
  };

  const handleUpdate = async () => {
    if (
      !updatedProduct.name ||
      !updatedProduct.description ||
      !updatedProduct.price ||
      updatedProduct.stock < 0
    ) {
      toast.error("All fields including stock must be valid.");
      return;
    }

    try {
      const updatedData = await updateProduct(id, updatedProduct);
      if (!updatedData) throw new Error("Failed to update");

      setProduct(updatedData);
      setEditMode(false);
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Failed to update product.");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image before uploading.", {
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setUploading(true);
      const { data } = await API.post("/upload", formData);
      if (data?.imageUrl) {
        setUpdatedProduct((prev) => ({ ...prev, image: data.imageUrl }));
        toast.success("Image uploaded successfully!", {
          position: "top-right",
        });
      } else {
        toast.error("Image upload failed. Try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Image upload failed due to an error.", {
        position: "top-right",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) return;

    try {
      const response = await addToCart(id, 1);
    
      if (response.status === 401) {
        toast.error("Only logged-in users can add items to the cart.");
        return;
      }
    
      if (response.ok) {
        setProduct((prev) => ({ ...prev, stock: prev.stock - 1 }));
        toast.success("Product added to cart!");
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (err) {
      toast.error("An error occurred. Try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product)
    return <p className="text-center text-gray-400">Product not found.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#242729] text-[#f5f5f5] py-10">
      <div className="w-full max-w-6xl px-8 py-10 bg-[#181a1b] rounded-lg shadow-xl border border-[#2c2f33]">
        <h2 className="text-4xl font-bold text-center mb-8">{product.name}</h2>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        {editMode ? (
          <>
            <label className="block text-gray-300 font-semibold mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={updatedProduct.name}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, name: e.target.value })
              }
              className="w-full px-4 py-2 mb-4 border border-gray-600 bg-gray-700 text-white rounded-md"
            />

            <label className="block text-gray-300 font-semibold mb-2">
              Description
            </label>
            <textarea
              value={updatedProduct.description}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-2 mb-4 border border-gray-600 bg-gray-700 text-white rounded-md resize-none"
              rows="4"
            />

            <label className="block text-gray-300 font-semibold mb-2">
              Price ($)
            </label>
            <input
              type="number"
              value={updatedProduct.price}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, price: e.target.value })
              }
              className="w-full px-4 py-2 mb-4 border border-gray-600 bg-gray-700 text-white rounded-md"
            />

            <label className="block text-gray-300 font-semibold mb-2">
              Stock
            </label>
            <input
              type="number"
              value={updatedProduct.stock}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, stock: e.target.value })
              }
              className="w-full px-4 py-2 mb-6 border border-gray-600 bg-gray-700 text-white rounded-md"
            />

            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-white"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>

            <button
              onClick={handleUpdate}
              className="w-full bg-[#f97316] text-white px-6 py-3 rounded-md hover:bg-[#ea580c] transition font-semibold mt-4"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-300">{product.description}</p>
            <p className="text-xl font-bold text-yellow-400 mt-2">
              ${product.price}
            </p>
            <p
              className={`text-lg font-semibold mt-2 ${
                product.stock > 0 ? "text-green-400" : "text-red-500"
              }`}
            >
              {product.stock > 0
                ? `In Stock: ${product.stock}`
                : "Out of Stock"}
            </p>

            {user?.isAdmin ? (
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Edit Product
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-800 transition"
                >
                  Delete Product
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="mt-6 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-700 transition"
              >
                Add to Cart
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
