import React from "react";

const Errors = ({ errors, length }) => {
  return (
    <div className="absolute right-8 top-[50%]">
      <button className="bg-red-600 px-4 py-2 rounded">{length} errors</button>
      {Object.keys(errors).map((key) => (
        <p key={key}>{key}</p>
      ))}
    </div>
  );
};

export default Errors;
