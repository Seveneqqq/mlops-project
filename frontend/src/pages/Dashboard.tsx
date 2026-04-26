"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import FilesTab from "../components/FilesTab"

export default function Dashboard() {
  const [tab, setTab] = useState("files")

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 border-r p-4 space-y-2">
        <Button
          variant={tab === "files" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setTab("files")}
        >
          Files
        </Button>

        <Button
          variant={tab === "etl" ? "default" : "ghost"}
          className="w-full justify-start"
        >
          ETL
        </Button>

        <Button
          variant={tab === "ml" ? "default" : "ghost"}
          className="w-full justify-start"
        >
          ML
        </Button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">
        {tab === "files" && <FilesTab />}
      </div>
    </div>
  )
}