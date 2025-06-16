import { MessageCircleHeart } from "lucide-react";
import { Link } from "react-router";

function FriendCard({ friend }) {
    return (
        <div className="card border rounded-3xl border-base-300 hover:shadow-lg transition-shadow duration-300">
            <div className="card-body p-3 sm:p-4 lg:p-5 sm:space-y-3 lg:space-y-4">
                {/* user info */}
                <div className="flex items-center gap-3">
                    <div className="avatar mr-2 size-12 sm:size-14 lg:size-16 rounded-full">
                        <img src={friend?.profilePic} alt={friend?.fullName} />
                    </div>
                    <h3 className="font-semibold truncate">{friend.fullName}</h3>
                </div>
                {friend?.bio && <p className="text-sm opacity-90">{friend?.bio}</p>}
                {/* chat page */}
                <Link
                    to={`/chat/${friend._id}`}
                    className="btn border-slate-700 border-r-primary border-r-2 border-b-primary hover:btn-ghost rounded-full"
                >
                    <MessageCircleHeart className="size-6" color="#f72585" />
                    Message
                </Link>
            </div>
        </div >
    )
}

export default FriendCard