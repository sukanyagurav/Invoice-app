import React from "react";

const Input = ({
  labelText,
  type,
  id,
  errors,
  register,
  name,
  valueAsNumber,
  placeholder = "",
}) => {
  console.log(register);
  return (
    <div className="flex flex-col mb-2 relative">
      <label htmlFor={id} className="opacity-[0.8] mt-4 flex-1">
        {labelText}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full border-[0.1rem] my-2 p-2 rounded-lg bg-transparent focus:outline-[#7C5DFA] flex-1 outline-none focus:border-none  ${
          errors ? "border-red" : "border-slate_500"
        }`}
        {...register(name)}
      />

      <span className="text-red-500 text-[0.75rem] block absolute -bottom-4">
        {errors ? errors.message : ""}
      </span>
    </div>
  );
};

export default Input;
