import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser"
import { BellDotIcon, Heart, Home, LogOutIcon, UserIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getfriendRequests } from "../lib/api";
import toast from "react-hot-toast";

function Sidebar() {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const currentPath = location.pathname;

    const { data: friendRequests } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getfriendRequests,
    });

    const incomingRequests = friendRequests?.incomingRequests || [];

    const { logoutMutation, error } = useLogout();

    const handleLogout = () => {
        { error && toast.error(error.response.data.message) };
        logoutMutation();
    }

    return (
        <aside className="w-64 hidden border ml-5 mt-5 mb-5 rounded-2xl border-base-300 lg:flex flex-col h-[calc(100vh-2.5rem)] sticky top-0">
            <div className="p-5 border-base-300">
                <Link to={"/"} className="flex items-center gap-2.5">
                    <Heart className="size-8 text-primary" />
                    <span className="text-3xl text-primary font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                        eXSe
                    </span>
                </Link>
            </div>
            <div className="flex-1 p-4 space-y-2">
                <Link
                    to={"/"}
                    className={`btn justify-start w-full gap-3 px-3 normal-case rounded-full ${currentPath === "/" ? "btn-active border-r-primary border-r-2 border-b-primary hover:btn-ghost" : ""}`}
                >
                    <Home className="size-5 text-base-content opacity-70" color="#f72585" />
                    <span>Home</span>
                </Link>
                <Link
                    to={"/friends"}
                    className={`btn justify-start w-full gap-3 px-3 normal-case rounded-full ${currentPath === "/friends" ? "btn-active border-r-primary border-r-2 border-b-primary hover:btn-ghost" : ""}`}
                >
                    <UserIcon className="size-5 text-base-content opacity-70" color="#f72585" />
                    <span>Friends</span>
                </Link>
                <Link
                    to={"/notifications"}
                    className={`btn justify-between w-full gap-3 px-3 normal-case rounded-full ${currentPath === "/notifications" ? "btn-active border-r-primary border-r-2 border-b-primary hover:btn-ghost" : ""}`}
                >
                    <div className="flex gap-3 items-center">
                        <BellDotIcon className="size-5 text-base-content opacity-70" color="#f72585" />
                        <span>Notifications</span>
                    </div>
                    <span className="badge rounded-full text-primary badge-primary ml-2">{incomingRequests.length}</span>
                </Link>
            </div>

            {/* user profile */}
            <div className="p-4 border-t border-base-300 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <Link to={"/me"}>
                                <img src={authUser?.profilePic} alt="user profile" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">
                            {authUser?.fullName}
                        </p>
                        <p className="text-xs text-success flex items-center gap-1">
                            <span className="size-2 rounded-full bg-success inline-block" />
                            Online
                        </p>
                    </div>
                    <LogOutIcon className="cursor-pointer" color="#f72585" onClick={handleLogout} />
                </div>
            </div>
        </aside >
    )
}

export default Sidebar