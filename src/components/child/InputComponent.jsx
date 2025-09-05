// --- New Reusable Components --- //
import { ChevronDown } from "lucide-react";

export const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  validationState,
  touchedFields,
  placeholder,
  required = false,
  maxLength,
  ...rest
}) => {
  const isTouched = touchedFields?.[name];
  const isInvalid = isTouched && validationState?.[name] === false;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
         onBlur={onBlur}    
        {...rest}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isInvalid ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      {isInvalid && (
        <p className="text-red-500 text-xs mt-1">*Invalid {label}</p>
      )}
    </div>
  );
};


export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  validationState,
  touchedFields,
  required = false,
  options,
}) => {
  const isTouched = touchedFields?.[name];
  const isInvalid = isTouched && validationState?.[name] === false;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
            isInvalid ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          size={16}
        />
      </div>
      {isInvalid && (
        <p className="text-red-500 text-xs mt-1">*Invalid {label}</p>
      )}
    </div>
  );
};


