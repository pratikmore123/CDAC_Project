import { Eye } from "lucide-react";
import { useState } from "react";

<<<<<<< HEAD
const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type, 
  isSelect, 
  options, 
  required,
  error,
  errorMessage,
  min,
  max,
  step,
  disabled
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="mb-4">
      <label className="text-[13px] text-slate-800 block mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {isSelect ? (
          <select
            className={`w-full bg-transparent outline-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed`}
            value={value}
            onChange={onChange}
            disabled={disabled}
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input 
            className={`w-full bg-transparent outline-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed`}
            type={type === "password" ? (showPassword ? "text" : "password") : type} 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
        )}

        {!isSelect && type === "password" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
            <Eye 
              size={20} 
              className={showPassword ? "text-primary" : "text-slate-400"}
              onClick={toggleShowPassword}
            />
          </span>
        )}
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
=======
const Input = ({ label, value, onChange, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="mb-4">
            <label className="text-[13px] text-slate-800 block mb-1">
                {label}
            </label>
            <div className="relative">
                <input 
                    className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    type={type === "password" ? (showPassword ? "text" : "password") : type} 
                    placeholder={placeholder} 
                    value={value}
                    onChange={(e) => onChange(e)} 
                />
                {type === "password" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        <Eye 
                            size={20} 
                            className={showPassword ? "text-primary" : "text-slate-400"}
                            onClick={toggleShowPassword}
                        />
                    </span>
                )}
            </div>
        </div>
    )
>>>>>>> 615710988a6ecef8bd4a45833db1a4f5089e5d3f
}

export default Input;