import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { signup } from "../lib/api.js";

function useSignup() {
    const navigate = useNavigate();

    const { mutate: signupMutation, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success("Account created successfully! :), Now Please login.");
            navigate("/login");
        },
    });
    return { signupMutation, isPending, error };
}

export default useSignup