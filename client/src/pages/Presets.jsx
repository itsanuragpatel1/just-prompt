import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Presets = () => {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const selectedPresetRef = useRef(null);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/preset/all`;
        const { data } = await axios.get(endpoint, { withCredentials: true });
        setPresets(data.presets);
      } catch (err) {
        setError('Failed to load presets.');
      } finally {
        setLoading(false);
      }
    };

    fetchPresets();
  }, []);

  // Step 1: preset click
  const handlePresetClick = (preset) => {
    selectedPresetRef.current = preset;
    fileInputRef.current.click();
  };

  // Step 2: image selected
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedPresetRef.current) return;

    navigate('/', {
      state: {
        presetPrompt: selectedPresetRef.current.prompt,
        presetImageFile: file
      }
    });
  };

  return (
    <div>
      <section className="text-center py-8 border-b border-gray-300 bg-gray-50 rounded-xl mx-6 mt-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Transform Instantly with What’s Hot Now
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Pick a preset, upload your photo, and generate instantly
        </p>
      </section>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageSelect}
        className="hidden"
      />

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading presets...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 p-4">
          {presets.map((preset) => (
            <img
              key={preset._id}
              src={preset.image}
              alt="preset"
              className="mb-4 rounded-lg cursor-pointer hover:scale-[1.02] transition"
              onClick={() => handlePresetClick(preset)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Presets;
