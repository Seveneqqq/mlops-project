"use client"

import { useEffect, useRef, useState } from "react"
import {
  Upload,
  FileText,
  Trash2,
  RefreshCw,
  CloudUpload,
  ChevronDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const API = import.meta.env.VITE_API_URL

const normalizeColumns = (cols: string[]) => {
  if (!cols || cols.length === 0) return []

  if (cols.length === 1) {
    return cols[0]
      .split(";")
      .map((c) => c.replace(/"/g, "").trim())
      .filter(Boolean)
  }

  return cols.map((c) => c.replace(/"/g, "").trim())
}

const short = (text: string, max = 40) =>
  text.length > max ? text.slice(0, max) + "..." : text

export default function FilesTab() {
  const [files, setFiles] = useState<string[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const [column, setColumn] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const fetchFiles = async () => {
    const res = await fetch(`${API}/files/`)
    const data = await res.json()
    setFiles(data.files || [])
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped?.name.endsWith(".csv")) {
      setFile(dropped)
    }
  }

  const openFilePicker = () => inputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f?.name.endsWith(".csv")) {
      setFile(f)
    }
  }

  const upload = async () => {
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${API}/files/upload`, {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    setSelected(data)
    setFile(null)
    setColumn(null)
    fetchFiles()
    setLoading(false)
  }

  const getInfo = async (filename: string) => {
    const res = await fetch(`${API}/files/${filename}`)
    const data = await res.json()

    setSelected(data)
    setColumn(null)
  }

  const remove = async (filename: string) => {
    await fetch(`${API}/files/${filename}`, {
      method: "DELETE",
    })

    fetchFiles()
    setSelected(null)
  }

  const parsedColumns = selected
    ? normalizeColumns(selected.columns)
    : []

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="space-y-6">

        {/* UPLOAD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudUpload size={18} />
              Upload Dataset
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div
              onClick={openFilePicker}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="
                border border-dashed rounded-xl
                p-10 text-center cursor-pointer
                hover:bg-muted/30 transition
              "
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />

              {file ? (
                <p className="font-medium">{file.name}</p>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto opacity-60" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click
                  </p>
                </div>
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
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText size={18} />
              Datasets
            </CardTitle>

            <Button variant="ghost" size="icon" onClick={fetchFiles}>
              <RefreshCw size={16} />
            </Button>
          </CardHeader>

          <CardContent className="space-y-2">
            {files.map((f) => (
              <div
                key={f}
                className="
                  flex justify-between items-center
                  p-2 rounded-lg hover:bg-muted/40
                "
              >
                <Button
                  variant="ghost"
                  onClick={() => getInfo(f)}
                  className="justify-start"
                >
                  {f}
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => remove(f)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT */}
      <div className="col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Dataset Details</CardTitle>
          </CardHeader>

          <CardContent>
            {selected ? (
              <div className="space-y-6">
                {/* META */}
                <div className="flex gap-3">
                    <Badge className="text-md">{selected.filename}</Badge>
                    <Badge className="text-md">{selected.records_count} rows</Badge>
                    <Badge className="text-md">{parsedColumns.length} columns</Badge>
                    <Badge className="text-md">{selected.size_kb} KB</Badge>
                </div>

                {/* COLUMN SELECT */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Browse columns
                  </p>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {column ? short(column) : "Select column"}
                        <ChevronDown size={16} />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0 w-96">
                      <Command>
                        <CommandInput placeholder="Search column..." />
                        <CommandList className="mt-2">
                          {parsedColumns.map((col: string) => (
                            <CommandItem
                              key={col}
                              onSelect={() => setColumn(col)}
                            >
                              {short(col)}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* SELECTED COLUMN */}
                {column && (
                  <Card>
                    <CardContent className="p-4 text-sm">
                      <p className="font-medium break-all">
                        {column}
                      </p>
                    </CardContent>
                  </Card>
                )}

              </div>
            ) : (
              <p className="text-muted-foreground">
                Select dataset to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}