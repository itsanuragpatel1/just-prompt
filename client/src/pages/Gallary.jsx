import React, { useEffect, useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { PiDownloadLight } from "react-icons/pi";
import axios from "axios";
import { downloadImage } from "../utils/downloadImage.js";
import LoaderComp from "../components/LoaderComp.jsx";

const Gallery = () => {
  const filters = ["All", "Edited", "Generated"];
  const [activeFilter, setActiveFilter] = useState("All");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Map filter → API
  const getEndpoint = (filter) => {
    switch (filter) {
      case "Edited":
        return "/api/user/edited-images";
      case "Generated":
        return "/api/user/generated-images";
      default:
        return "/api/user/all-images";
    }
  };

  const getImages = async (filter) => {
    try {
      setLoading(true);

      const endpoint = `${BASE_URL}${getEndpoint(filter)}`;

      const res = await axios.get(endpoint, {
        withCredentials: true, // IMPORTANT for auth cookie
      });

      setImages(res.data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getImages(activeFilter);
  }, [activeFilter]);

  return (
    <div>
      {/* Header */}
      <section className="px-6 py-6 border-b border-gray-200 bg-white/70 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="w-full md:w-auto text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Creations
            </h2>
            <p className="text-sm text-gray-500">
              Manage your edited and generated visuals
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 border border-gray-200 rounded-full shadow-sm overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap
                ${
                  activeFilter === filter
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <LoaderComp/>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-400">
            No images found
          </p>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4">
            {images.map((img) => (
              <div
                key={img._id}
                className="mb-4 rounded-lg overflow-hidden relative group"
              >
                <img
                  src={img.imageUrl}
                  alt="user image"
                  className="w-full rounded-lg"
                />

                {/* Hover Actions */}
                <div className="gap-4 items-center absolute top-2 right-2 bg-white rounded-lg p-2 hidden group-hover:flex shadow hover:bg-green-100">
                  <PiDownloadLight
                    className="text-xl cursor-pointer "
                    title="Download"
                    onClick={() => downloadImage(img.imageUrl) }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
