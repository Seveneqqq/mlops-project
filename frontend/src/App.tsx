"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc"
import { Toaster } from "sonner"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"

import StudentSurvey from "./pages/StudentSuccessSurvey"
import Dashboard from "./pages/Dashboard"

const MotionButton = motion(Button)

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  const API = import.meta.env.VITE_API_URL

  const handleLogin = () => {
    window.location.href = `${API}/auth/login`
  }

  // 🔥 CHECK USER
  const checkLoginResult = async () => {
    try {
      const token = localStorage.getItem("access_token")

      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const response = await fetch(`${API}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 🔥 1. ZŁAP TOKEN Z URL
    const params = new URLSearchParams(window.location.search)

    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")

    if (accessToken && refreshToken) {
      console.log("🔥 TOKENY Z URL")

      localStorage.setItem("access_token", accessToken)
      localStorage.setItem("refresh_token", refreshToken)

      // usuń z URL
      window.history.replaceState({}, document.title, "/")

      // redirect
      window.location.href = "/home"
      return
    }

    // 🔥 2. NORMAL FLOW
    if (hasFetched.current) return
    hasFetched.current = true

    checkLoginResult()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <Router>
      <Routes>

        {/* HOME */}
        <Route path="/home" element={<Dashboard />} />

        {/* ANKIETA */}
        <Route path="/survey" element={<StudentSurvey />} />

        {/* MAIN */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6"
                >
                  <h1 className="text-2xl font-semibold text-center mb-4">
                    MLOps Platform
                  </h1>

                  <p className="text-gray-400 text-sm text-center mb-6">
                    Zarządzaj ML i sprawdź swoje szanse ukończenia studiów
                  </p>

                  <div className="flex flex-col gap-3">

                    <MotionButton
                      onClick={handleLogin}
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center gap-2 py-5"
                    >
                      <FcGoogle size={20} />
                      Zaloguj się przez Google
                    </MotionButton>

                    <Button
                      onClick={() => (window.location.href = "/survey")}
                      variant="outline"
                      className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      Przejdź do ankiety
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Logowanie opcjonalne
                  </p>
                </motion.div>

                <Toaster />
              </div>
            )
          }
        />
      </Routes>
    </Router>
  )
}