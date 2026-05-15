"use client"

import {
  Info,
  Database,
  GitBranch,
  BarChart3,
  Brain,
  Server,
  Cloud,
  CheckCircle,
  Code2,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  "Pozyskiwanie i przetwarzanie danych",
  "Przechowywanie danych w bazie relacyjnej",
  "Pipeline ETL z możliwością konfiguracji",
  "Trenowanie modeli ML",
  "Wybór domyślnego modelu predykcyjnego",
  "Dashboard do zarządzania plikami, ETL, ML i modelami",
  "Integracja z API backendowym",
  "Elementy MLOps i automatyzacji pipeline",
]

const stack = [
  "React",
  "TypeScript",
  "Vite",
  "TailwindCSS",
  "shadcn/ui",
  "FastAPI / API backend",
  "Python",
  "scikit-learn",
  "Azure Storage",
  "Relacyjna baza danych",
]

export default function AboutTab() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info size={18} />
              About Project
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Projekt przedstawia kompletną platformę analityczną typu
              MLOps, której celem jest obsługa procesu pracy z danymi:
              od załadowania plików, przez przetwarzanie ETL, aż po
              trenowanie modeli predykcyjnych i zarządzanie ich wersjami.
            </p>

            <p>
              System został przygotowany w ramach projektu zespołowego
              z zakresu hurtowni danych oraz metod analitycznych. Aplikacja
              umożliwia odtworzenie pełnego przepływu danych w czystym
              środowisku oraz prezentuje wyniki w formie dashboardu.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>Data Warehouse</Badge>
              <Badge variant="outline">ETL</Badge>
              <Badge variant="outline">Machine Learning</Badge>
              <Badge variant="outline">MLOps</Badge>
              <Badge variant="outline">Dashboard</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={18} />
              Functionalities
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-2 rounded-lg border p-3 text-sm"
              >
                <CheckCircle size={16} className="text-green-500 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 size={18} />
              Tech Stack
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch size={18} />
              Architecture
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Cloud size={16} />
              <span>Azure Storage dla plików i modeli</span>
            </div>

            <div className="flex items-center gap-3">
              <Database size={16} />
              <span>Baza danych dla metadanych i konfiguracji</span>
            </div>

            <div className="flex items-center gap-3">
              <Server size={16} />
              <span>Backend API obsługujący ETL i ML</span>
            </div>

            <div className="flex items-center gap-3">
              <Brain size={16} />
              <span>Modele predykcyjne trenowane na danych</span>
            </div>

            <div className="flex items-center gap-3">
              <BarChart3 size={16} />
              <span>Dashboard frontendowy dla użytkownika</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Scope</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Projekt spełnia wymagania obejmujące bazę danych,
              pipeline ETL, model predykcyjny, dashboard oraz elementy
              MLOps.
            </p>

            <Badge className="mt-2">
              Target grade: db / db+
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}