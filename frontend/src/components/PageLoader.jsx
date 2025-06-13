import { Loader2 } from "lucide-react"

function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin size-8 text-primary" />
        </div>
    )
}

export default PageLoader