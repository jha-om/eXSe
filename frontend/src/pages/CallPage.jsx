import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    StreamTheme,
    CallingState,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function CallPage() {
    const { id: callId } = useParams();

    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    const { authUser, isLoading } = useAuthUser();

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        // we want to run this query after only we get back the user from authUser fn;
        enabled: !!authUser // !! == Boolean();
    });

    console.log(tokenData);

    useEffect(() => {
        const initCall = async () => {
            if (!tokenData.token || !authUser || !callId) return;

            try {
                console.log("stream video client");
                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic
                }

                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token,
                })

                const callInstance = videoClient.call("default", callId);
                await callInstance.join({
                    create: true
                });

                setClient(videoClient);
                setCall(callInstance);
            } catch (error) {
                console.error("error joining call:", error);
                toast.error("not able join the call, please try again after sometime...")
            } finally {
                setIsConnecting(false);
            }
        }

        initCall();
    }, [authUser, tokenData, callId]);

    if (isLoading || isConnecting) {
        return <PageLoader />
    }
    return (
        <div className="h-[calc(100vh-3rem)] p-4 sm:p-6 lg:p-8 border m-5 border-base-300 rounded-2xl bg-transparent flex flex-col items-center justify-center">
            <div className="relative">
                {client && call ? (
                    <StreamVideo client={client}>
                        <StreamCall call={call}>
                            <Callcontent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>Not able to initialize the call? Please refresh the page or try again later sometime</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const Callcontent = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();

    const navigate = useNavigate();

    if (callingState === CallingState.LEFT) {
        return navigate("/");
    }

    return (
        <StreamTheme>
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    )
}

export default CallPage