import { useState } from "react"
import { Heart } from 'lucide-react';
import { Link, useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { signup } from "../lib/api.js";

function SignupPage() {
    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    // const queryClient = useQueryClient();

    // const { mutate, isPending, error } = useMutation({
    //     mutationFn: async () => {
    //         const response = await axiosInstance.post("/auth/signup", signupData);
    //         return response.data;
    //     },
    //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
    // });

    const { mutate:signupMutation, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            console.log("Signup successful!");
            toast.success("Account created successfully! :), Now Please login.");
            navigate("/login");
        },
        onError: (error) => {
            console.log("Signup error:", error);
            toast.error(error?.response?.data?.message || "Signup failed");
        }
    })

    console.log("Current isPending state:", isPending);

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("Form submitted, isPending:", isPending);
        console.log("Signup data:", signupData);
        signupMutation(signupData);
    }

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="black">
            <div className="border border-primary/35 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

                {/* signup form - left side */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* logo */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <Heart className="size-9 text-primary" />
                        <span className="text-3xl text-primary font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            eXSe
                        </span>
                    </div>

                    {/* ERROR MESSAGE IF ANY */}
                    {error && (
                        <div className="alert alert-error mb-4 rounded-xl">
                            <span>{error.response.data.message}</span>
                        </div>
                    )}

                    <div className="w-full">
                        <form onSubmit={handleSignup}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Create an account</h2>
                                    <p className="text-sm opacity-70">
                                        Join eXSe and start conversation with your ex.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Full Name</span>
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Purana aashiq"
                                            className="input input-bordered w-full rounded-full"
                                            value={signupData.fullName}
                                            onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="puranaAashiq@gmail.com"
                                            className="input input-bordered w-full rounded-full"
                                            value={signupData.email}
                                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>

                                        <input type="password"
                                            placeholder="Password must be at least 6 characters long"
                                            className="input input-bordered w-full rounded-full"
                                            value={signupData.password}
                                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input type="checkbox" className="checkbox checkbox-sm rounded-full" required />
                                            <span className="text-xs leading-tight">
                                                I agree to the{" "}
                                                <span className="text-primary hover:underline">terms of service</span> and{" "}
                                                <span className="text-primary hover:underline">privacy policy</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button className="btn btn-primary font-extrabold w-full rounded-full bg-primary/75" type="submit">
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs text-white">
                                                Loading...
                                            </span>
                                        </>
                                    ) : (
                                            "Create Account"
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Already have an account?{" "}
                                        <Link to="/login" className="text-primary hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* signup side - right side */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src="/calling.png" alt="eXSe baat" className="w-full h-full" />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Connect with your ex...</h2>
                            <p className="opacity-70">
                                Have a conversation with your ex, without your current one know(s)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage