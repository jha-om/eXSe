import { Navigate, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import { Toaster } from "react-hot-toast"
import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js"
import Layout from "./components/Layout.jsx"

function App() {
  const { authUser, isLoading } = useAuthUser()

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="h-screen" data-theme="black">
      <Routes>
        {/* home page */}
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)}
        />

        {/* signup page*/}
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to={"/"} />} />
        
        {/* login page*/}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={
          isOnboarded ? "/" : "/onboarding"
        } />} />

        {/* notifications page */}
        <Route path="/notifications" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <NotificationsPage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )} />

        {/* call page */}
        <Route path="/call/:id" element={isAuthenticated && isOnboarded ? (
          <CallPage />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )} />
        
        {/* specific chat page */}
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={false}>
            <ChatPage />
          </Layout>
        ) : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />} />
        
        {/* onboarding page */}
        <Route path="/onboarding" element={isAuthenticated ? (
          !isOnboarded ? (
            <OnboardingPage />
          ) : (
            <Navigate to={"/"} />
          )
        ) : (
          <Navigate to="/login" />
        )} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App