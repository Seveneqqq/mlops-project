"use client"

import { useEffect, useState } from "react"
import {
  Workflow,
  CheckCircle,
  Settings2,
  Brain,
  Database,
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
    max_iter: { value: 1000, min: 100, max: 5000 },
    C: { value: 1.0, min: 0.01, max: 10 },
    solver: { value: "lbfgs" },
    penalty: { value: "l2" },
    random_state: { value: 42 },
  },
  random_forest: {
    n_estimators: { value: 100, min: 10, max: 1000 },
    max_depth: { value: 10, min: 1, max: 50 },
    min_samples_split: { value: 2, min: 2, max: 20 },
    min_samples_leaf: { value: 1, min: 1, max: 20 },
    max_features: { value: "sqrt" },
    bootstrap: { value: true },
    random_state: { value: 42 },
  },
}

const ETL_DEFAULT = {
  drop_na: false,
  fill_na: "median",
  encode_categorical: true,
  scale_numeric: "standard",
}

export default function PipelineTab() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState("")

  const [etlSteps, setEtlSteps] = useState<any>(ETL_DEFAULT)

  const [model, setModel] = useState("random_forest")
  const [target, setTarget] = useState("Target_Graduate")

  const [params, setParams] = useState<any>({})
  const [result, setResult] = useState<any>(null)

  const [loading, setLoading] = useState(false)

  const fetchFiles = async () => {
    const res = await fetch(`${API}/files/`)
    const data = await res.json()
    setFiles(data.files || [])
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    const defaults = MODEL_DEFAULTS[model]
    const initial: any = {}

    Object.entries(defaults).forEach(([k, v]: any) => {
      initial[k] = v.value
    })

    setParams(initial)
  }, [model])

  const runPipeline = async () => {
    setLoading(true)

    const parsedParams: any = {}

    Object.entries(params).forEach(([k, v]) => {
      if (v === "" || v === null) return

      if (typeof v === "boolean") {
        parsedParams[k] = v
      }
      else if (v === "true") {
        parsedParams[k] = true
      }
      else if (v === "false") {
        parsedParams[k] = false
      }
      else if (!isNaN(Number(v))) {
        parsedParams[k] = Number(v)
      }
      else {
        parsedParams[k] = v
      }
    })

    const res = await fetch(`${API}/pipeline/full`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        etl: {
          filename: selectedFile,
          steps: etlSteps,
        },
        ml: {
          target,
          model_type: model,
          params: parsedParams,
        },
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

        {/* ETL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Database size={16} />
              ETL Config
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <Button
              variant={etlSteps.drop_na ? "default" : "outline"}
              onClick={() =>
                setEtlSteps({ ...etlSteps, drop_na: !etlSteps.drop_na })
              }
            >
              Drop NA
            </Button>

            <div className="flex gap-2">
              {["mean", "median", "mode"].map((v) => (
                <Button
                  key={v}
                  variant={etlSteps.fill_na === v ? "default" : "outline"}
                  onClick={() =>
                    setEtlSteps({ ...etlSteps, fill_na: v })
                  }
                >
                  {v}
                </Button>
              ))}
            </div>

            <Button
              variant={etlSteps.encode_categorical ? "default" : "outline"}
              onClick={() =>
                setEtlSteps({
                  ...etlSteps,
                  encode_categorical: !etlSteps.encode_categorical,
                })
              }
            >
              Encoding
            </Button>

            <div className="flex gap-2">
              {["standard", "minmax"].map((v) => (
                <Button
                  key={v}
                  variant={etlSteps.scale_numeric === v ? "default" : "outline"}
                  onClick={() =>
                    setEtlSteps({ ...etlSteps, scale_numeric: v })
                  }
                >
                  {v}
                </Button>
              ))}
            </div>

          </CardContent>
        </Card>

        {/* MODEL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Brain size={16} />
              Model
            </CardTitle>
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
            <CardTitle>Target</CardTitle>
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
            <CardTitle className="flex gap-2 items-center">
              <Settings2 size={16} />
              Params
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {Object.entries(MODEL_DEFAULTS[model]).map(([key, meta]: any) => {
              const value = params[key]

              return (
                <div key={key} className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {key}
                    {meta.min !== undefined &&
                      ` (min: ${meta.min}, max: ${meta.max})`}
                  </p>

                  {typeof meta.value === "boolean" ? (
                    <Button
                      variant={value ? "default" : "outline"}
                      onClick={() =>
                        setParams({
                          ...params,
                          [key]: !value,
                        })
                      }
                    >
                      {value ? "true" : "false"}
                    </Button>
                  ) : (
                    <Input
                      value={String(value ?? "")}
                      onChange={(e) =>
                        setParams({
                          ...params,
                          [key]: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Button
          onClick={runPipeline}
          disabled={!selectedFile || loading}
          className="w-full"
        >
          {loading ? "Running..." : "Run Full Pipeline"}
        </Button>

      </div>

      {/* RIGHT */}
      <div className="col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Pipeline Result</CardTitle>
          </CardHeader>

          <CardContent>
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Workflow className="animate-spin" size={16} />
                Processing pipeline...
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">

                <div>
                  <p className="text-sm font-medium mb-2">ETL</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge>{result.etl.processed_filename}</Badge>
                    <Badge>{result.etl.records_count} rows</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">ML</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge>{result.ml.model_name}</Badge>
                    <Badge>{result.ml.accuracy}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle size={16} />
                  Full pipeline completed
                </div>

              </div>
            )}

            {!result && !loading && (
              <p className="text-muted-foreground">
                Run pipeline to see results
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}