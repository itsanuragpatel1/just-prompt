import React from "react";
import { CiImageOn } from "react-icons/ci";


const Placeholder = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        className="w-full h-full 
        border-2 border-dashed border-gray-300
        rounded-2xl
        flex flex-col items-center justify-center
        text-center
        cursor-pointer
        bg-white
        hover:border-gray-500 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-50
        transition-all duration-300"
      >
        {/* Icon */}
        <div className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 text-3xl">
          <CiImageOn/>
        </div>

        {/* Primary Action */}
        <p className="text-lg font-medium text-gray-800">
          Upload an image
        </p>

        {/* Secondary */}
        <p className="mt-1 text-sm text-gray-500">
          or drag & drop here
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4 text-gray-400 text-xs">
          <span className="h-px w-12 bg-gray-300" />
          OR
          <span className="h-px w-12 bg-gray-300" />
        </div>

        {/* Prompt CTA */}
        <p className="text-base text-gray-600">
          Write a prompt to generate an image
        </p>

        {/* Hint */}
        <p className="mt-3 text-xs text-gray-400">
          Supports PNG, JPG • Max 10MB
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
