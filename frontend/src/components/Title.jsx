import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="mb-3 inline-flex items-center gap-3">
      <p className="text-sm font-light tracking-[0.18em] text-gray-500 sm:text-base">
        {text1}{" "}
        <span className="font-semibold text-gray-900">
          {text2}
        </span>
      </p>

      <span className="h-px w-8 bg-gray-800 sm:w-12" />
    </div>
  );
};

export default Title;