"use client"

import { useEffect, useState } from "react"
import {
  Settings2,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const API = import.meta.env.VITE_API_URL

type Steps = {
  drop_na: boolean
  fill_na: "mean" | "median" | "mode" | null
  encode_categorical: boolean
  scale_numeric: "standard" | "minmax" | null
}

export default function EtlTab() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string>("")

  const [options, setOptions] = useState<any>(null)

  const [steps, setSteps] = useState<Steps>({
    drop_na: false,
    fill_na: null,
    encode_categorical: false,
    scale_numeric: null,
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchFiles = async () => {
    const res = await fetch(`${API}/files/`)
    const data = await res.json()
    setFiles(data.files || [])
  }

  const fetchOptions = async () => {
    const res = await fetch(`${API}/etl/options`)
    const data = await res.json()
    setOptions(data)
  }

  useEffect(() => {
    fetchFiles()
    fetchOptions()
  }, [])

  const runETL = async () => {
    if (!selectedFile) return

    setLoading(true)

    const res = await fetch(`${API}/etl/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: selectedFile,
        steps,
      }),
    })

    const data = await res.json()

    setResult(data)
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Select Dataset</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {files.map((f) => (
              <Button
                key={f}
                variant={selectedFile === f ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFile(f)}
              >
                {f}
              </Button>
            ))}
          </CardContent>
        </Card>

        {options && (
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Settings2 size={16} />
                ETL Config
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div>
                <p className="text-sm">Drop NA</p>
                <Button
                  variant={steps.drop_na ? "default" : "outline"}
                  onClick={() =>
                    setSteps({ ...steps, drop_na: !steps.drop_na })
                  }
                >
                  {steps.drop_na ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div>
                <p className="text-sm">Fill NA</p>
                <div className="flex gap-2">
                  {["mean", "median", "mode"].map((v) => (
                    <Button
                      key={v}
                      variant={steps.fill_na === v ? "default" : "outline"}
                      onClick={() =>
                        setSteps({ ...steps, fill_na: v as Steps["fill_na"] })
                      }
                    >
                      {v}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm">Encoding</p>
                <Button
                  variant={steps.encode_categorical ? "default" : "outline"}
                  onClick={() =>
                    setSteps({
                      ...steps,
                      encode_categorical: !steps.encode_categorical,
                    })
                  }
                >
                  {steps.encode_categorical ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div>
                <p className="text-sm">Scaling</p>
                <div className="flex gap-2">
                  {["standard", "minmax"].map((v) => (
                    <Button
                      key={v}
                      variant={steps.scale_numeric === v ? "default" : "outline"}
                      onClick={() =>
                        setSteps({
                          ...steps,
                          scale_numeric: v as Steps["scale_numeric"],
                        })
                      }
                    >
                      {v}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full mt-4"
                onClick={runETL}
                disabled={!selectedFile || loading}
              >
                {loading ? "Processing..." : "Run ETL"}
              </Button>

            </CardContent>
          </Card>
        )}
      </div>

      {/* RIGHT */}
      <div className="col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>ETL Result</CardTitle>
          </CardHeader>

          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Badge>{result.filename}</Badge>
                  <Badge>{result.processed_filename}</Badge>
                  <Badge>{result.records_count} rows</Badge>
                </div>

                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle size={16} />
                  Pipeline completed
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Run ETL to see results
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}