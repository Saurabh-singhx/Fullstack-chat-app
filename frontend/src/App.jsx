import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import HomePage from "./pages/HomePage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { useThemeStore } from "./store/useThemeStore"
import './App.css'


function App() {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {

    checkAuth();

  }, [checkAuth])

  // console.log("Auth User:", authUser);
  
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <>
      <div data-theme={theme} >
        <Navbar />

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
