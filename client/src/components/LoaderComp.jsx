import React from 'react'

const LoaderComp = ({ size = 100 }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center mt-6">
      <img
        src="/loading.gif"
        alt="Loading..."
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default LoaderComp;