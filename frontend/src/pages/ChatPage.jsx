import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react"
import { StreamChat } from "stream-chat";
import ChatLoader from "../components/ChatLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// TODO: i've to add logout functionality on the chatpage navbar;

function ChatPage() {
    const { id: otherUserId } = useParams();

    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);

    const { authUser } = useAuthUser();

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        // we want to run this query after only we get back the user from authUser fn;
        enabled: !!authUser // !! == Boolean();
    });

    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser) return;
            try {
                const client = StreamChat.getInstance(STREAM_API_KEY);
                await client.connectUser({
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic
                }, tokenData.token);

                const channelId = [authUser._id, otherUserId].sort().join("-");
                
                // Try to get other user info from your backend first
                let otherUserData = null;
                try {
                    // You might need to create an API call to get user info from your backend
                    // const response = await fetch(`/api/users/${otherUserId}`);
                    // otherUserData = await response.json();
                    
                    // Alternative: Try to query from Stream Chat
                    const { users } = await client.queryUsers({ id: otherUserId });
                    otherUserData = users[0];
                } catch (queryError) {
                    console.log("Could not query user, will use default name");
                }

                const currentChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, otherUserId],
                    // Try different approaches for the channel name
                    name: otherUserData?.name || otherUserData?.fullName || `User ${otherUserId}`,
                    // You can also try setting additional metadata
                    ...(otherUserData && {
                        data: {
                            name: otherUserData.name || otherUserData.fullName,
                            image: otherUserData.image || otherUserData.profilePic
                        }
                    })
                });

                await currentChannel.watch();
                
                // After watching, try to get member info
                const members = Object.values(currentChannel.state.members);
                const otherMember = members.find(member => member.user_id !== authUser._id);
                
                if (otherMember) {
                    setOtherUser(otherMember.user);
                    // Update channel name if we got better info
                    if (otherMember.user.name && !currentChannel.data.name?.includes(otherMember.user.name)) {
                        await currentChannel.update({
                            name: otherMember.user.name
                        });
                    }
                }

                setChatClient(client);
                setChannel(currentChannel);
            } catch (error) {
                console.error("error initializing chat:", error);
                toast.error("could not connect to chat, please try again later :)")
            } finally {
                setLoading(false);
            }
        }

        initChat();
    }, [authUser, otherUserId, tokenData])


    if (loading || !chatClient || !channel) {
        return <ChatLoader />
    }

    return (
        <div className="h-[calc(100vh-7rem)] p-4 sm:p-6 lg:p-8 border m-5 border-base-300 rounded-2xl bg-transparent">
            <div className="h-full rounded-2xl overflow-hidden bg-transparent">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                    <Channel channel={channel}>
                        <Window>
                            <div className="custom-chat-container h-full flex flex-col">
                                <div className="custom-header bg-transparent border-b border-base-300 p-4 rounded-t-2xl">
                                    <ChannelHeader />
                                </div>
                                <div className="custom-messages flex-1 bg-transparent overflow-hidden">
                                    <MessageList />
                                </div>
                                <div className="custom-input bg-transparent border-t border-base-300 p-4 rounded-b-2xl">
                                    <MessageInput focus />
                                </div>
                            </div>
                        </Window>
                    </Channel>
                </Chat>
            </div>
        </div>
    )
}

export default ChatPage