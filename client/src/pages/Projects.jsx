import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoaderComp from "../components/LoaderComp";

const Projects = () => {
  const filters = ["All", "Edit", "Generated"];
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // 🔹 Map filter → API
  const getEndpoint = (filter) => {
    switch (filter) {
      case "Edit":
        return "/api/user/edit-projects";
      case "Generated":
        return "/api/user/generated-projects";
      default:
        return "/api/user/all-projects";
    }
  };

  const getProjects = async (filter) => {
    try {
      setLoading(true);

      const endpoint = `${BASE_URL}${getEndpoint(filter)}`;

      const res = await axios.get(endpoint, {
        withCredentials: true,
      });

      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load & filter change
  useEffect(() => {
    getProjects(activeFilter);
  }, [activeFilter]);

  return (
    <div>
      {/* Header */}
      <section className="px-6 py-6 border-b border-gray-200 bg-white/70 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="w-full md:w-auto text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Projects
            </h2>
            <p className="text-sm text-gray-500">
              Manage your generate and edit workflows
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
      <div className="p-6">
        {loading ? (
          <LoaderComp/>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-400">
            No projects found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
  onClick={() => navigate(`/project/${project._id}`)}
  className="group relative cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
>
  <img
    src={project.lastImage?.imageUrl}
    className="w-full h-64 object-cover group-hover:scale-105 transition"
  />

  {/* Meta overlay */}
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
    <div className="flex justify-between items-center">
      <span className="text-xs text-white/90 bg-black/40 px-2 py-1 rounded-full">
        {project.projectType}
      </span>
      <span className="text-xs text-white/70">
        {new Date(project.updatedAt).toLocaleDateString()}
      </span>
    </div>
  </div>
</div>

            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
