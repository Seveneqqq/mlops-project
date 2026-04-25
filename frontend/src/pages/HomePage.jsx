"use client"

import React from "react"


export default function HomePage() {
  return (
      <main className="w-full flex-1 px-6 py-2">
        <h1 className="text-3xl font-bold my-2">Welcome to the Home Page!</h1>
          <div className="flex gap-6">
            {/* <ApiPanel />
            <FilePanel /> */}
          </div>
          {/* <TasksHistoryPanel action="get_historical_data" /> */}
      </main>
  )
}
