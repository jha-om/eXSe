import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import toast from "react-hot-toast";

function useLogout() {
    const queryClient = useQueryClient();

    const { mutate: logoutMutation, isPending, error } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success("Logout successfully");
            queryClient.setQueryData(["authUser"], null);
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        }
    })

    return { logoutMutation, isPending, error }
}

export default useLogout