import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { login } from "../lib/api";
import { Heart } from 'lucide-react';
import { Link } from "react-router";

function LoginPage() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    const queryClient = useQueryClient();

    const { mutate: loginMutation, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
    });

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation(loginData);
    }

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="black">
            <div className="border border-primary/35 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

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
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Login</h2>
                                    <p className="text-sm opacity-70">
                                        Login and start conversation with your ex.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="puranaAashiq@gmail.com"
                                            className="input input-bordered w-full rounded-full"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <button className="btn btn-primary font-extrabold w-full rounded-full bg-primary/75" type="submit">
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs text-white"></span>
                                            Loading...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Doesn't have an account?{" "}
                                        <Link to="/signup" className="text-primary hover:underline">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* login side - right side */}
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

export default LoginPage