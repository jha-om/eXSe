import { useLocation, Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser"
import { BellDotIcon, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getfriendRequests } from "../lib/api";


function Navbar() {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

    const { data: friendRequests } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getfriendRequests,
    });

    const incomingRequests = friendRequests?.incomingRequests || [];


    return (
        <nav className="bg-base-100 border m-5 rounded-full border-base-300 sticky top-0 z-30 h-[4.8rem] flex items-center">
            <div className={`flex items-center w-full px-6 ${isChatPage ? 'justify-between' : 'justify-end'}`}>
                {/* logo -- only in the chat page */}
                {isChatPage && (
                    <div>
                        <Link to={"/"} className="flex items-center gap-2.5">
                            <Heart className="size-9 text-primary" />
                            <span className="text-3xl text-primary font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                                eXSe
                            </span>
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-4 sm:gap-5">
                    <Link to={"/notifications"}>
                        <button className="btn btn-circle relative">
                            <BellDotIcon className="h-6 w-6 text-base-content opacity-70" />
                            <span className="absolute top-[-5px] right-[-8px] sm:text-sm badge rounded-full text-primary bg-base-300 ml-2">{incomingRequests.length}</span>
                        </button>
                    </Link>
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <Link to={"/me"}>
                                <img src={authUser?.profilePic} alt="user profile" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default Navbar