import { Navigate, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import { Toaster } from "react-hot-toast"
import {
  useQuery
} from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios.js"

function App() {
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
    // if we want that tanstack don't really try 4 times again for the api calling;
    // we can use retry: false;
    retry: false, //auth check => if user is unauthorized for 1st time, then it means it will be same for n'th time also;

  });
  console.log("authdata", authData);
  const authUser = authData?.user
  console.log(authUser);
  
  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={"/"} />} />
        <Route path="/login" element={!authUser ? <LoginPage />  : <Navigate to={"/"} />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to={"/login"} />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage />  : <Navigate to={"/login"} />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App