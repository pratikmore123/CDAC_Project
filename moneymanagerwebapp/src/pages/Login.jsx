import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import { AppContext } from "../context/appContext";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
        // Basic validation
        if (!validateEmail(email)) {
            throw new Error("Please enter a valid email address");
        }

        if (!password.trim() || password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }

        // Login API call
        const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
            email,
            password
        });

        // Debug the full response structure
        console.log("Full API Response:", response);
        
        // Check if response exists and has data
        if (!response) {
            throw new Error("No response from server");
        }

        // Handle case where data might be in response.data or directly in response
        const responseData = response.data || response;
        
        if (!responseData) {
            throw new Error("Empty response from server");
        }

        console.log("Response Data:", responseData);


        // In your handleSubmit function, modify the success handler:
        if (responseData.token && responseData.user) {
           localStorage.setItem("token", responseData.token);
           setUser(responseData.user); // This will use our normalized setter
           toast.success("Login successful");
           navigate("/dashboard");
        } else {
            throw new Error(responseData.message || "Invalid server response format");
        }

    } catch (error) {
        let errorMessage = "Login failed. Please try again.";
        
           if(error.response && error.response.data.message)
           {
            setError(error.response.data.message);
           }
           else{
            console.error("Something went wrong",error);
            setError(error.message);
           }

        if (error.response) {
            // Handle axios response errors
            const serverError = error.response.data || error.response;
            errorMessage = serverError.message || 
                         serverError.error ||
                         (error.response.status === 401 ? "Invalid credentials" : 
                          error.response.status === 400 ? "Bad request" : 
                          "Server error");
        } else if (error.request) {
            // The request was made but no response was received
            errorMessage = "No response from server - check your connection";
        } else if (error.message) {
            // Something happened in setting up the request
            errorMessage = error.message;
        }

        console.error("Login Error Details:", {
            error: error,
            response: error.response,
            request: error.request
        });
        setError(errorMessage);
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
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        Login to Your Account
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8"> 
                        Welcome back! Please enter your credentials.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                            placeholder="name@example.com"
                            type="email"
                            disabled={isLoading}
                        />
                        <Input 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            disabled={isLoading}
                        />
                        
                        {error && (
                            <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}
                        <button
                            disabled={isLoading}
                            className={`w-full py-3 px-4 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors flex items-center justify-center gap-2 ${
                                isLoading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            type="submit"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Logging in...
                                </>
                            ) : "LOGIN"}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Don't have an account?{' '}
                            <Link 
                                to="/signup" 
                                className="font-medium text-purple-600 underline hover:text-purple-700 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;