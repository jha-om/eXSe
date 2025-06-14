import { useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser"
import { Link } from "react-router";
import { BellDotIcon } from "lucide-react";

function Navbar() {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");
    // console.log(isChatPage);

    return (
        <nav className="bg-base-100 border-base-300 sticky top-0 z-30 h-[4.8rem] flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full">
                    {/* logo -- only in the chat page */}
                    {isChatPage && (
                        <div className="pl-5">
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
                            <button className="btn btn-circle">
                                <BellDotIcon className="h-6 w-6 text-base-content opacity-70" />
                            </button>
                        </Link>
                    </div>

                    <div className="avatar ml-5">
                        <div className="w-10 rounded-full">
                            <img src={authUser?.profilePic} alt="user profile" />
                            <Link to={"/me"} />
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default Navbar