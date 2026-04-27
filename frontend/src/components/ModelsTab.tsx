"use client"

import { useEffect, useState } from "react"
import {
  Brain,
  Star,
  CheckCircle,
  RefreshCw,
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

export default function ModelsTab() {
  const [models, setModels] = useState<string[]>([])
  const [defaultModel, setDefaultModel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // 🔹 fetch models from Azure
  const fetchModels = async () => {
    setLoading(true)

    try {
      const res = await fetch(`${API}/files/models`)
      const data = await res.json()
      setModels(data.files || [])
    } catch (e) {
      console.error("models error:", e)
    }

    setLoading(false)
  }

  // 🔹 fetch default model from DB
  const fetchDefault = async () => {
    try {
      const res = await fetch(`${API}/models/default`)
      const data = await res.json()
      setDefaultModel(data.model_name)
    } catch {
      setDefaultModel(null)
    }
  }

  useEffect(() => {
    fetchModels()
    fetchDefault()
  }, [])

  // 🔹 set default model
  const setDefault = async (model: string) => {
    setSaving(true)

    try {
      await fetch(`${API}/models/default`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_name: model,
        }),
      })

      setDefaultModel(model)
    } catch (e) {
      console.error("set default error:", e)
    }

    setSaving(false)
  }

  return (
    <div className="grid grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="col-span-1 space-y-6">

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Brain size={18} />
              Models
            </CardTitle>

            <Button variant="ghost" size="icon" onClick={fetchModels}>
              <RefreshCw size={16} />
            </Button>
          </CardHeader>

          <CardContent className="space-y-2">
            {loading && (
              <p className="text-sm text-muted-foreground">
                Loading...
              </p>
            )}

            {!loading && models.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No models found
              </p>
            )}

            {models.map((m) => {
              const isDefault = m === defaultModel

              return (
                <div
                  key={m}
                  className={`
                    flex items-center justify-between
                    p-3 rounded-lg border
                    transition
                    ${isDefault ? "border-primary bg-primary/5" : "hover:bg-muted/40"}
                  `}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium break-all">
                      {m}
                    </span>

                    {isDefault && (
                      <span className="text-xs text-primary flex items-center gap-1 mt-1">
                        <CheckCircle size={12} />
                        Default
                      </span>
                    )}
                  </div>

                  <Button
                    size="icon"
                    variant={isDefault ? "default" : "outline"}
                    disabled={isDefault || saving}
                    onClick={() => setDefault(m)}
                  >
                    <Star size={14} />
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>

      </div>

      {/* RIGHT */}
      <div className="col-span-2">

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Model Details</CardTitle>
          </CardHeader>

          <CardContent>
            {defaultModel ? (
              <div className="space-y-4">

                <div className="flex gap-3 flex-wrap">
                  <Badge variant="default">
                    Default Model
                  </Badge>

                  <Badge variant="outline">
                    {defaultModel}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle size={16} />
                  Model ready for predictions
                </div>

              </div>
            ) : (
              <p className="text-muted-foreground">
                No default model selected
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}