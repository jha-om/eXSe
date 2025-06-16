import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { getOutgoingFriendRequest, getRecommendedUsers, getUserFriends, sendFriendRequest } from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import NoRecommendedFriend from "../components/NoRecommendedFriend";

function HomePage() {
    const queryClient = useQueryClient();
    // why we're having this state, it's because when we send a friend request to someone we want their friend request button to disabled and change the text to request sent.
    const [outgoingReqIds, setOutgoingReqIds] = useState(new Set());

    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends
    });

    const { data: recommendedUsers = [], isLoading: loadingRecommendedUser } = useQuery({
        queryKey: ["users"],
        queryFn: getRecommendedUsers
    });

    const { data: outgoingFriendRequest } = useQuery({
        queryKey: ["outgoingFriendRequest"],
        queryFn: getOutgoingFriendRequest
    });

    const { mutate: sendRequestMutation, isPending } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequest"] })
    });

    useEffect(() => {
        const outgoingIds = new Set();
        if (outgoingFriendRequest && outgoingFriendRequest.length > 0) {
            outgoingFriendRequest.forEach((req) => {
                outgoingIds.add(req.recipient._id);
            });
            setOutgoingReqIds(outgoingIds);
        }
    }, [outgoingFriendRequest]);

    return (
        <div className="h-[calc(90.5vh-2.5rem)] p-4 sm:p-6 lg:p-8 border m-5 border-base-300 rounded-2xl">
            <div className="container mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
                    <Link
                        to={"/notifications"}
                        className="btn border-slate-700 border-r-primary border-r-2 border-b-primary hover:btn-ghost btn-sm rounded-full"
                    >
                        <UsersIcon className="mr-2 size-4" color="#f72585" />
                        <span className="hidden lg:inline xl:inline">Friend Requests</span>
                        <span className="sm:inline md:inline lg:hidden xl:hidden">Requests</span>
                    </Link>
                </div>

                {loadingFriends ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : friends.length === 0 ? (
                    <NoFriendsFound />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {friends.map((friend) => (
                            <FriendCard key={friend._id} friend={friend} />
                        ))}
                    </div>
                )}

                <section>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Friends</h2>
                            <p className="opacity-70 mb-15">
                                Discover a new friend from anywhere in the world :)
                            </p>
                        </div>
                    </div>
                    {loadingRecommendedUser ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : recommendedUsers.length === 0 ? (
                        <NoRecommendedFriend />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {recommendedUsers.map((recommendedUser) => {
                                const hasRequestBeenSent = outgoingReqIds.has(recommendedUser._id);
                                return (
                                    <div
                                        className="card border rounded-3xl border-base-300 hover:shadow-lg transition-all duration-300"
                                        key={recommendedUser._id}
                                    >
                                        <div className="card-body p-3 sm:p-4 lg:p-5 sm:space-y-3 lg:space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar size-12 sm:size-14 lg:size-16 rounded-full">
                                                    <img src={recommendedUser.profilePic} alt={recommendedUser.fullName} />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg truncate">
                                                        {recommendedUser.fullName}
                                                    </h3>
                                                    {recommendedUser.location && (
                                                        <div className="flex items-center text-sm opacity-90 mt-1">
                                                            <MapPinIcon className="size-3 mr-1" color="#f72585" />
                                                            {recommendedUser.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {recommendedUser.bio && <p className="text-md opacity-90">{recommendedUser.bio}</p>}

                                            <button
                                                className={`btn bg-primary/20 sm:p-1 rounded-full w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                                                    }`}
                                                onClick={() => sendRequestMutation(recommendedUser._id)}
                                                disabled={hasRequestBeenSent || isPending}
                                            >
                                                {hasRequestBeenSent ? (
                                                    <>
                                                        <CheckCircleIcon className="size-4 mr-1 sm:mr-2" color="#f72585" />
                                                        <span className="hidden lg:inline xl:inline">Request Sent</span>
                                                        <span className="sm:inline md:inline lg:hidden xl:hidden">Sent</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlusIcon className="size-4 mr-1 sm:mr-2" color="#f72585" />
                                                        <span className="hidden lg:inline xl:inline">Send Friend Request</span>
                                                        <span className="sm:inline md:inline lg:hidden xl:hidden">Add Friend</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default HomePage