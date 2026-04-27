"use client"

import { useEffect, useState } from "react"
import {
  Trophy,
  Settings2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const API = import.meta.env.VITE_API_URL

const MODEL_DEFAULTS: any = {
  logistic_regression: {
    max_iter: 1000,
    C: 1.0,
    solver: "lbfgs",
    penalty: "l2",
    random_state: 42,
  },
  random_forest: {
    n_estimators: 100,
    max_depth: 3,
    min_samples_split: 2,
    min_samples_leaf: 1,
    max_features: "sqrt",
    bootstrap: true,
    random_state: 42,
  },
}

export default function MLTab() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState("")

  const [target, setTarget] = useState("Target_Graduate")
  const [model, setModel] = useState("logistic_regression")

  const [params, setParams] = useState<any>(
    MODEL_DEFAULTS["logistic_regression"]
  )

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchFiles = async () => {
    const res = await fetch(`${API}/files/processed`)
    const data = await res.json()
    setFiles(data.files || [])
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    setParams({ ...MODEL_DEFAULTS[model] })
  }, [model])

  const train = async () => {
    setLoading(true)

    const parsedParams: any = {}

    Object.entries(params).forEach(([k, v]) => {
      if (v === "" || v === null) {
        parsedParams[k] = null
        return
      }

      if (v === "true") parsedParams[k] = true
      else if (v === "false") parsedParams[k] = false
      else if (!isNaN(Number(v))) parsedParams[k] = Number(v)
      else parsedParams[k] = v
    })

    const res = await fetch(`${API}/ml/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: selectedFile,
        target,
        model_type: model,
        params: parsedParams,
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

        {/* FILE */}
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

        {/* MODEL */}
        <Card>
          <CardHeader>
            <CardTitle>Model</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {Object.keys(MODEL_DEFAULTS).map((m) => (
              <Button
                key={m}
                variant={model === m ? "default" : "outline"}
                onClick={() => setModel(m)}
                className="w-full"
              >
                {m}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* TARGET */}
        <Card>
          <CardHeader>
            <CardTitle>Target Column</CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* PARAMS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 size={16} />
              Model Params
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {key}
                </p>

                                <Input
                  value={String(value ?? "")}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      [key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button
          onClick={train}
          disabled={!selectedFile || !target || loading}
          className="w-full"
        >
          {loading ? "Training..." : "Train Model"}
        </Button>

      </div>

      {/* RIGHT */}
      <div className="col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Training Result</CardTitle>
          </CardHeader>

          <CardContent>
            {result ? (
              <div className="space-y-4">

                <div className="flex gap-3 flex-wrap">
                  <Badge>{result.model_name}</Badge>
                  <Badge>{result.accuracy}</Badge>
                </div>

                <div className="flex items-center gap-2 text-green-500">
                  <Trophy size={16} />
                  Model trained successfully
                </div>

              </div>
            ) : (
              <p className="text-muted-foreground">
                Train model to see results
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}