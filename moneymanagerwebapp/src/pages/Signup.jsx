import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
        if (!fullName.trim()) {
            setError("Please enter your full name");
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        setError("");

        // Signup API call
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password
            });
            
            if (response.status === 201) {
                toast.success("Account created successfully");
                navigate("/login");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
            setError(error.message);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Background image with blur */}
            <img 
                src={assets.bg_img} 
                alt="background" 
                className="absolute inset-0 w-full h-full object-cover filter blur-sm" 
            />

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-gray-800 text-center mb-2">
                        Create An Account
                    </h3>
                    <p className="text-sm text-gray-600 text-center mb-8"> 
                        Start tracking your expenses with us today.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                label="Full Name"
                                placeholder="John Doe"
                                type="text"
                                disabled={isLoading}
                            />
                            <Input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email Address"
                                placeholder="name@example.com"
                                type="email"
                                disabled={isLoading}
                            />
                            <div className="col-span-2">
                                <Input 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label="Password"
                                    placeholder="••••••••"
                                    type="password"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button
                            disabled={isLoading}
                            className={`w-full py-3 px-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            type="submit"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>

                        <p className="text-sm text-gray-600 text-center mt-4">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-purple-600 hover:text-purple-700 font-medium underline transition-colors"
                            >
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;