import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { acceptFriendRequest, getfriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheck } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

function NotificationsPage() {
    const queryClient = useQueryClient();

    const { data: friendRequests, isLoading } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getfriendRequests,
    });

    const { mutate: acceptRequestMutations, isPending } = useMutation({
        mutationFn: acceptFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
            queryClient.invalidateQueries({ queryKey: ["friends"] })
        }
    });

    const incomingRequests = friendRequests?.incomingRequests || [];
    const acceptedRequests = friendRequests?.acceptedRequests || [];

    return (
        <div className="p-4 sm:p-6 lg:p-8 border m-5 border-base-300 rounded-2xl">
            <div className="container mx-auto space-y-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : (
                    <>
                        {incomingRequests.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-primary" />
                                    Friend Requests
                                    <span className="badge rounded-full text-primary badge-primary ml-2">{incomingRequests.length}</span>
                                </h2>
                                <div className="space-y-3">
                                    {incomingRequests.map((request) => (
                                        <div
                                            key={request._id}
                                            className="card bg-base-100 border border-base-300 rounded-3xl flex flex-col transition-shadow"
                                        >
                                            <div className="card-body p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar w-14 h-14 rounded-full bg-base-300 overflow-hidden">
                                                            <img src={request.sender.profilePic} alt={request.sender.fullName} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">
                                                                {request.sender.fullName}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                                <p className="text-md opacity-90">{request.sender.bio}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn btn-primary bg-primary/20 rounded-full"
                                                        onClick={() => acceptRequestMutations(request._id)}
                                                        disabled={isPending}
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* accepted reqs notifications */}
                {acceptedRequests.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <BellIcon className="h-5 w-5 text-success" color="#f72585"/>
                            New Connections
                        </h2>

                        <div className="space-y-3">
                            {acceptedRequests.map((notification) => (
                                <div key={notification._id} className="card bg-base-2000 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="avatar mt-1 size-10 rounded-full">
                                                <img src={notification.recipient.profilePic} alt={notification.recipient.fullName} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                                            <p className="text-sm my-1">
                                                {notification.recipient.fullName} accepted your friend request
                                            </p>
                                            <p className="text-xs flex items-center opacity-90">
                                                <ClockIcon className="h-3 w-3 mr-1" color="#f72585"/>
                                                Recently
                                            </p>
                                        </div>
                                        <div className="badge rounded-full border border-r-primary border-r-2 border-b-primary border-slate-600">
                                            <MessageSquareIcon className="h-3 w-3 mr-1" color="#f72585"/>
                                            New Friend
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
                    <NoNotificationsFound />
                )}
            </div>
        </div>
    )
}

export default NotificationsPage