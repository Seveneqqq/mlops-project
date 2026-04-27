"use client"

import { useState } from "react"
import {
  Files,
  Database,
  Brain,
  History,
  Workflow,
  Boxes,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

import FilesTab from "../components/FilesTab"
import EtlTab from "../components/EtlTab"
import MLTab from "../components/MLTab"
import PipelineTab from "../components/PipelineTab"

const managementTabs = [
  { id: "files", label: "Files", icon: Files },
  { id: "etl", label: "ETL", icon: Database },
  { id: "ml", label: "ML", icon: Brain },

  // 🔥 NEW
  { id: "pipelines", label: "Pipelines", icon: Workflow },
  { id: "models", label: "Models", icon: Boxes },
]

const historyTabs = [
  { id: "history", label: "History", icon: History },
]

export default function Dashboard() {
  const [tab, setTab] = useState("files")
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 border-r flex flex-col">

        {/* LOGO */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">MLOps</h1>
          <p className="text-xs text-muted-foreground">
            AI Platform
          </p>
        </div>

        {/* NAV */}
        <div className="flex-1 p-3 space-y-6">

          {/* MANAGEMENT */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground px-2">
              Management
            </p>

            {managementTabs.map((t) => {
              const Icon = t.icon

              return (
                <Button
                  key={t.id}
                  variant={tab === t.id ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={18} />
                  {t.label}
                </Button>
              )
            })}
          </div>

          {/* HISTORY */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground px-2">
              History
            </p>

            {historyTabs.map((t) => {
              const Icon = t.icon

              return (
                <Button
                  key={t.id}
                  variant={tab === t.id ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={18} />
                  {t.label}
                </Button>
              )
            })}
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          v1.0 • Azure
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold capitalize">
            {tab}
          </h2>

          <Button
            variant="outline"
            className="rounded-full px-4"
            onClick={() => navigate("/survey")}
          >
            Survey
          </Button>
        </div>

        {/* TABS */}
        {tab === "files" && <FilesTab />}
        {tab === "etl" && <EtlTab />}
        {tab === "ml" && <MLTab />}
        {tab === "pipelines" && <PipelineTab />}
        {tab === "models" && <div>Models coming soon...</div>}
        {tab === "history" && <div>History coming soon...</div>}
      </div>
    </div>
  )
}