"use client"

import { useEffect, useState } from "react"
import {
  Upload,
  FileText,
  Trash2,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const API = import.meta.env.VITE_API_URL

export default function FilesTab() {
  const [files, setFiles] = useState<string[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  console.log("API:", API)

  // 🔹 LIST FILES
  const fetchFiles = async () => {
    try {
      console.log("GET FILES...")
      const res = await fetch(`${API}/files/`)
      const data = await res.json()
      console.log("FILES:", data)

      setFiles(data.files || [])
    } catch (e) {
      console.error("FILES ERROR:", e)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  // 🔹 DRAG DROP
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.name.endsWith(".csv")) {
      setFile(dropped)
    }
  }

  // 🔹 UPLOAD
  const upload = async () => {
    if (!file) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("UPLOADING:", file.name)

      const res = await fetch(`${API}/files/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      console.log("UPLOAD RESULT:", data)

      setSelected(data)
      setFile(null)
      fetchFiles()
    } catch (e) {
      console.error("UPLOAD ERROR:", e)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 INFO
  const getInfo = async (filename: string) => {
    try {
      const res = await fetch(`${API}/files/${filename}`)
      const data = await res.json()
      console.log("INFO:", data)
      setSelected(data)
    } catch (e) {
      console.error("INFO ERROR:", e)
    }
  }

  // 🔹 DELETE
  const remove = async (filename: string) => {
    try {
      await fetch(`${API}/files/${filename}`, {
        method: "DELETE",
      })
      fetchFiles()
      setSelected(null)
    } catch (e) {
      console.error("DELETE ERROR:", e)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* LEFT PANEL */}
      <div className="space-y-6">

        {/* DROPZONE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={18} />
              Upload CSV
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border border-dashed rounded-lg p-6 text-center cursor-pointer"
            >
              {file ? (
                <p>{file.name}</p>
              ) : (
                <p>Przeciągnij plik CSV tutaj</p>
              )}
            </div>

            <Button
              className="w-full mt-4"
              onClick={upload}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </CardContent>
        </Card>

        {/* FILE LIST */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText size={18} />
              Files
            </CardTitle>

            <Button variant="ghost" size="icon" onClick={fetchFiles}>
              <RefreshCw size={16} />
            </Button>
          </CardHeader>

          <CardContent className="space-y-2">
            {files.map((f) => (
              <div
                key={f}
                className="flex items-center justify-between"
              >
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => getInfo(f)}
                >
                  {f}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => remove(f)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>File Details</CardTitle>
          </CardHeader>

          <CardContent>
            {selected ? (
              <pre className="text-sm">
                {JSON.stringify(selected, null, 2)}
              </pre>
            ) : (
              <p>No file selected</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}