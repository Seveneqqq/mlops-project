"use client"

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "motion/react"
import {
  Files,
  Database,
  Brain,
  LibraryBig,
  Workflow,
  Boxes,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

import FilesTab from "../components/FilesTab"
import EtlTab from "../components/EtlTab"
import MLTab from "../components/MLTab"
import PipelineTab from "../components/PipelineTab"
import ModelsTab from "../components/ModelsTab"
import AboutTab from "../components/AboutTab"

const managementTabs = [
  { id: "files", label: "Files", icon: Files },
  { id: "etl", label: "ETL", icon: Database },
  { id: "ml", label: "ML", icon: Brain },
  { id: "pipelines", label: "Pipelines", icon: Workflow },
  { id: "models", label: "Models", icon: Boxes },
]

const AboutTabs = [
  { id: "about", label: "About", icon: LibraryBig },
]

const pageVariants : Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.18,
    },
  },
}

const blockVariants : Variants = {
  initial: {
    opacity: 0,
    y: 42,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.98,
    transition: {
      duration: 0.16,
      ease: "easeOut",
    },
  },
}

const insideVariants : Variants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 22,
      mass: 0.8,
      delay: 0.16,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.12,
    },
  },
}

export default function Dashboard() {
  const [tab, setTab] = useState("files")
  const navigate = useNavigate()

  const renderTab = () => {
    switch (tab) {
      case "files":
        return <FilesTab />
      case "etl":
        return <EtlTab />
      case "ml":
        return <MLTab />
      case "pipelines":
        return <PipelineTab />
      case "models":
        return <ModelsTab />
      case "about":
        return <AboutTab />
      default:
        return <FilesTab />
    }
  }

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 border-r flex flex-col bg-background/95 backdrop-blur-xl">
        {/* LOGO */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold tracking-tight">
            MLOps
          </h1>

          <p className="text-xs text-muted-foreground">
            AI Platform
          </p>
        </div>

        {/* NAV */}
        <div className="flex-1 p-3 space-y-6">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground px-2">
              Management
            </p>

            {managementTabs.map((t) => {
              const Icon = t.icon
              const active = tab === t.id

              return (
                <motion.div
                  key={t.id}
                  whileHover={{
                    x: 5,
                    transition: {
                      type: "spring",
                      stiffness: 500,
                      damping: 26,
                    },
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant={active ? "default" : "ghost"}
                    className="relative w-full justify-start gap-3 rounded-xl overflow-hidden"
                    onClick={() => setTab(t.id)}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-sidebar-pill"
                        className="absolute inset-0 rounded-xl bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-3">
                      <Icon size={18} />
                      {t.label}
                    </span>
                  </Button>
                </motion.div>
              )
            })}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground px-2">
              About
            </p>

            {AboutTabs.map((t) => {
              const Icon = t.icon
              const active = tab === t.id

              return (
                <motion.div
                  key={t.id}
                  whileHover={{
                    x: 5,
                    transition: {
                      type: "spring",
                      stiffness: 500,
                      damping: 26,
                    },
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant={active ? "default" : "ghost"}
                    className="relative w-full justify-start gap-3 rounded-xl overflow-hidden"
                    onClick={() => setTab(t.id)}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-sidebar-pill"
                        className="absolute inset-0 rounded-xl bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 32,
                        }}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-3">
                      <Icon size={18} />
                      {t.label}
                    </span>
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          v1.0 • Azure
        </div>
      </aside>

      {/* CONTENT */}
      <main className="relative flex-1 p-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.14),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* HEADER */}
        <motion.div
          layout
          className="flex items-center justify-between mb-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
            >
              <h2 className="text-3xl font-bold capitalize">
                {tab}
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Machine Learning Operations Dashboard
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 22,
            }}
          >
            <Button
              variant="outline"
              className="rounded-full px-5 bg-background/80 backdrop-blur"
              onClick={() => navigate("/survey")}
            >
              Survey
            </Button>
          </motion.div>
        </motion.div>

        {/* PAGE */}
        <AnimatePresence mode="wait">
          <motion.section
            key={tab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            {/* BLOK WYJEŻDŻA PIERWSZY */}
            <motion.div
              variants={blockVariants}
              className="rounded-3xl border bg-background/70 p-4 shadow-xl shadow-black/5 backdrop-blur-xl"
            >
              {/* ŚRODEK WJEŻDŻA CHWILĘ PÓŹNIEJ */}
              <motion.div variants={insideVariants}>
                {renderTab()}
              </motion.div>
            </motion.div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  )
}