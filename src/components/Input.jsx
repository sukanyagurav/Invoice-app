const Input = ({
  labelText,
  type = "text",
  id,
  errors,
  register,
  name,
  valueAsNumber = false,
  placeholder = "",
  ...inputProps
}) => (
  <div className="field">
    <label htmlFor={id}>{labelText} <sup>*</sup></label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className={`input-control ${errors ? "input-invalid" : ""}`}
      aria-invalid={Boolean(errors)}
      aria-describedby={errors ? `${id}-error` : undefined}
      {...register(name, { valueAsNumber })}
      {...inputProps}
    />
    {errors && <span className="field-error" id={`${id}-error`}>{errors.message}</span>}
  </div>
);

export default Input;
