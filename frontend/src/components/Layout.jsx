import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

function Layout({children, showSidebar = false}) {
    return (
        <div className="min-h-screen">
            <div className="flex">
                {showSidebar && <Sidebar />}

                <div className="flex-1">
                    <Navbar />

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Layout