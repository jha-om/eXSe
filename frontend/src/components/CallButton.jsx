import { VideoIcon } from "lucide-react"

function CallButton({ handleVideoCall }) {
    return (
        <div className="p-3 flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
            <button
                className="btn rounded-3xl text-white"
                onClick={handleVideoCall}>
                    <VideoIcon className="size-6" />
            </button>
        </div>
    )
}

export default CallButton