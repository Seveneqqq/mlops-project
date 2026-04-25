"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc"
import { toast, Toaster } from "sonner"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"

import StudentSurvey from "./pages/StudentSuccessSurvey"

const MotionButton = motion(Button)

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  const handleLogin = () => {
    window.location.href = "http://localhost:80/auth/login"
  }

  const checkLoginResult = async () => {
    try {
      const response = await fetch("http://localhost:80/auth/me", {
        method: "GET",
        credentials: "include",
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

        {/* ANKIETA - dostępna dla wszystkich */}
        <Route path="/survey" element={<StudentSurvey />} />

        {/* STRONA GŁÓWNA */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/survey" replace />
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="
                    w-full max-w-md
                    bg-white/5
                    backdrop-blur-xl
                    border border-white/10
                    shadow-2xl
                    rounded-2xl
                    p-6
                  "
                >
                  <h1 className="text-2xl font-semibold text-center mb-4">
                    MLOps Platform
                  </h1>

                  <p className="text-gray-400 text-sm text-center mb-6">
                    Zarządzaj pipeline’ami ML i sprawdź swoje szanse ukończenia studiów.
                  </p>

                  <div className="flex flex-col gap-3">

                    {/* LOGIN */}
                    <MotionButton
                      onClick={handleLogin}
                      className="
                        w-full
                        bg-white/10
                        hover:bg-white/20
                        border border-white/10
                        text-white
                        flex items-center justify-center gap-2
                        py-5
                      "
                    >
                      <FcGoogle size={20} />
                      Zaloguj się przez Google
                    </MotionButton>

                    {/* BEZ LOGOWANIA */}
                    <Button
                      onClick={() => (window.location.href = "/survey")}
                      variant="outline"
                      className="
                        w-full
                        border-purple-500/30
                        text-purple-300
                        hover:bg-purple-500/10
                      "
                    >
                      Przejdź do ankiety bez logowania
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Logowanie nie jest wymagane do testu modelu
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