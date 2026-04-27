"use client"

import { useState } from "react"
import {
  Files,
  Database,
  Brain,
  Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import FilesTab from "../components/FilesTab"
import ETLTab from "../components/EtlTab"
import MLTab from "../components/MLTab"

const tabs = [
  { id: "files", label: "Files", icon: Files },
  { id: "etl", label: "ETL", icon: Database },
  { id: "ml", label: "ML", icon: Brain },
]

export default function Dashboard() {
  const [tab, setTab] = useState("files")

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
        <div className="flex-1 p-3 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon

            return (
              <Button
                key={t.id}
                variant={tab === t.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3"
                )}
                onClick={() => setTab(t.id)}
              >
                <Icon size={18} />
                {t.label}
              </Button>
            )
          })}
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

          <Button variant="outline" size="icon">
            <Menu size={16} />
          </Button>
        </div>

        {/* TABS */}
        {tab === "files" && <FilesTab />}
        {tab === "etl" && <ETLTab />}
        {tab === "ml" && <MLTab />}
      </div>
    </div>
  )
}