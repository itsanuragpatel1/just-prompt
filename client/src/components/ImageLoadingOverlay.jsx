import { useEffect, useState } from "react";

const ImageLoadingOverlay = () => {
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const start = Date.now();
    setStartTime(start);

    const interval = setInterval(() => {
      setElapsed(((Date.now() - start) / 1000).toFixed(1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray/40 backdrop-blur-sm">
      
      {/* Spinner */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>

      {/* Timer */}
      <p className="mt-4 text-white text-sm tracking-wide">
        Generating… {elapsed}s
      </p>

      <p className="mt-1 text-xs text-white/60">
        Please wait
      </p>
    </div>
  );
};

export default ImageLoadingOverlay;
