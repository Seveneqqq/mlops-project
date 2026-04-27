"use client"

import { useEffect, useState } from "react"
import {
  Trophy,
  Settings2,
  Loader2,
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

  // 🔹 FETCH FILES (processed only)
  const fetchFiles = async () => {
    const res = await fetch(`${API}/files/processed`)
    const data = await res.json()
    setFiles(data.files || [])
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  // 🔹 RESET PARAMS WHEN MODEL CHANGES
  useEffect(() => {
    setParams({ ...MODEL_DEFAULTS[model] })
  }, [model])

  // 🔹 TRAIN
  const train = async () => {
    setLoading(true)
    setResult(null)

    const parsedParams: any = {}

    Object.entries(params).forEach(([k, v]) => {
      if (v === "" || v === null) {
        parsedParams[k] = null
        return
      }

      if (v === true || v === "true") {
        parsedParams[k] = true
        return
      }

      if (v === false || v === "false") {
        parsedParams[k] = false
        return
      }

      if (!isNaN(Number(v))) {
        parsedParams[k] = Number(v)
        return
      }

      parsedParams[k] = v
    })

    try {
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
    } catch (e) {
      console.error("TRAIN ERROR:", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* LEFT PANEL */}
      <div className="space-y-6">

        {/* FILE SELECT */}
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

        {/* TRAIN BUTTON */}
        <Button
          onClick={train}
          disabled={!selectedFile || !target || loading}
          className="w-full flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          {loading ? "Training..." : "Train Model"}
        </Button>

      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Training Result</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Loader2 className="animate-spin" size={28} />
                <p>Training model...</p>
              </div>
            ) : result ? (
              <div className="space-y-6">

                {/* RESULT BADGES */}
                <div className="flex flex-wrap gap-3">
                  <Badge className="text-md">{result.model_name}</Badge>
                  <Badge className="text-md">
                    Accuracy: {(result.accuracy * 100).toFixed(2)}%
                  </Badge>
                </div>

                {/* SUCCESS */}
                <div className="flex items-center gap-2 text-green-500">
                  <Trophy size={18} />
                  Model trained successfully
                </div>

                {/* DETAILS */}
                <Card>
                  <CardContent className="p-4 text-sm space-y-1">
                    <p><b>Dataset:</b> {selectedFile}</p>
                    <p><b>Target:</b> {target}</p>
                    <p><b>Model:</b> {model}</p>
                  </CardContent>
                </Card>

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