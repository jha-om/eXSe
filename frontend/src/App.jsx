import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import axios from "axios"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import { Toaster } from "react-hot-toast"
import {
  useQuery
} from "@tanstack/react-query"

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["eXSe"],
    queryFn: async () => {
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
      return response.data;
    }
  });

  console.log(data);
  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App