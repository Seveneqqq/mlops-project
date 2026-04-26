"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MotionCard = motion(Card)
const MODEL_NAME = "random_forest_2026-04-21_23-17-39.pkl"

const yesNo = {
  1: "Tak",
  0: "Nie",
}

const gender = {
  0: "Kobieta",
  1: "Mężczyzna",
}

const marital = {
  1: "Singiel",
  2: "Żonaty / Zamężna",
  3: "Wdowiec",
  4: "Rozwiedziony",
  5: "Związek partnerski",
  6: "Separacja",
}

const attendance = {
  1: "Studia dzienne",
  0: "Studia wieczorowe",
}

const courses = {
  33: "Biofuels",
  171: "Animacja i multimedia",
  8014: "Praca socjalna (wieczorowa)",
  9003: "Rolnictwo",
  9070: "Grafika komunikacyjna",
  9085: "Weterynaria",
  9119: "Informatyka",
  9130: "Jeździectwo",
  9147: "Zarządzanie",
  9238: "Praca socjalna",
  9254: "Turystyka",
  9500: "Pielęgniarstwo",
  9556: "Higiena jamy ustnej",
  9670: "Marketing",
  9773: "Dziennikarstwo",
  9853: "Edukacja",
  9991: "Zarządzanie (wieczorowe)",
}

const applicationMode = {
  1: "1. tura – ogólna",
  2: "Rozporządzenie 612/93",
  5: "Specjalna (Azory)",
  7: "Inne studia wyższe",
  10: "Rozporządzenie 854-B/99",
  15: "Student międzynarodowy",
  16: "Specjalna (Madera)",
  17: "2. tura – ogólna",
  18: "3. tura – ogólna",
  26: "Zmiana planu",
  27: "Inna uczelnia",
  39: "Powyżej 23 lat",
  42: "Transfer",
  43: "Zmiana kierunku",
  44: "Dyplom techniczny",
  51: "Zmiana uczelni",
  53: "Krótkie studia",
  57: "Zmiana uczelni (zagranica)",
}

const previousQualification = {
  1: "Średnie",
  2: "Licencjat",
  3: "Studia wyższe",
  4: "Magister",
  5: "Doktor",
  6: "W trakcie studiów",
  9: "Nieukończona szkoła średnia",
  10: "Nieukończona 11 klasa",
  12: "Inne",
  14: "10 klasa",
  15: "Nieukończona 10 klasa",
  19: "Podstawowe (9-11 klasa)",
  38: "Podstawowe (6-8 klasa)",
  39: "Szkoła techniczna",
  40: "Licencjat (1 stopień)",
  42: "Techniczne studia",
  43: "Magister (2 stopień)",
}

const parentQualification = {
  1: "Średnie",
  2: "Licencjat",
  3: "Studia wyższe",
  4: "Magister",
  5: "Doktor",
  9: "Nieukończona szkoła średnia",
  14: "10 klasa",
  19: "Podstawowe",
  34: "Nieznane",
  35: "Niepiśmienny",
  36: "Czyta bez szkoły",
  37: "Podstawowe 1-5 klasa",
  38: "Podstawowe 6-8 klasa",
  39: "Techniczne",
  40: "Licencjat",
  42: "Techniczne wyższe",
  43: "Magister",
  44: "Doktor",
}

const occupation = {
  0: "Student",
  1: "Dyrektor / kierownictwo",
  2: "Specjalista",
  3: "Technik",
  4: "Administracja",
  5: "Usługi / sprzedaż",
  6: "Rolnictwo",
  7: "Przemysł / budownictwo",
  8: "Operator maszyn",
  9: "Niewykwalifikowany",
  10: "Wojsko",
  90: "Inne",
  122: "Zdrowie",
  123: "Nauczyciel",
  125: "IT",
}

const nationality = {
  1: "Portugalia",
  2: "Niemcy",
  6: "Hiszpania",
  11: "Włochy",
  14: "Anglia",
  17: "Litwa",
  21: "Angola",
  22: "Wyspy Zielonego Przylądka",
  24: "Gwinea",
  25: "Mozambik",
  41: "Brazylia",
  62: "Rumunia",
  100: "Mołdawia",
  103: "Ukraina",
  105: "Rosja",
}

const map = (obj: any) =>
  Object.entries(obj).map(([k, v]) => ({
    value: Number(k),
    label: v,
  }))

const questions = [

  { key: "Marital status", label: "Status cywilny", type: "select", options: map(marital) },

  { key: "Application mode", label: "Tryb aplikacji", type: "select", options: map(applicationMode) },

  { key: "Application order", label: "Który wybór (0–9)", type: "number", min: 0, max: 9 },

  { key: "Course", label: "Kierunek", type: "select", options: map(courses) },

  { key: "Daytime/evening attendance\t", label: "Tryb studiów", type: "select", options: map(attendance) },

  { key: "Previous qualification", label: "Poprzednie wykształcenie", type: "select", options: map(previousQualification) },

  { key: "Previous qualification (grade)", label: "Ocena poprzednia (0–200)", type: "number", min: 0, max: 200 },

  { key: "Nacionality", label: "Narodowość", type: "select", options: map(nationality) },

  { key: "Mother's qualification", label: "Wykształcenie matki", type: "select", options: map(parentQualification) },

  { key: "Father's qualification", label: "Wykształcenie ojca", type: "select", options: map(parentQualification) },

  { key: "Mother's occupation", label: "Zawód matki", type: "select", options: map(occupation) },

  { key: "Father's occupation", label: "Zawód ojca", type: "select", options: map(occupation) },

  { key: "Admission grade", label: "Ocena rekrutacyjna (0-200)", type: "number", min: 0, max: 200 },

  { key: "Displaced", label: "Czy przesiedlony?", type: "select", options: map(yesNo) },

  { key: "Educational special needs", label: "Specjalne potrzeby?", type: "select", options: map(yesNo) },

  { key: "Debtor", label: "Zaległości finansowe?", type: "select", options: map(yesNo) },

  { key: "Tuition fees up to date", label: "Opłaty uregulowane?", type: "select", options: map(yesNo) },

  { key: "Gender", label: "Płeć", type: "select", options: map(gender) },

  { key: "Scholarship holder", label: "Stypendium?", type: "select", options: map(yesNo) },

  { key: "Age at enrollment", label: "Wiek (17-70)", type: "number", min: 17, max: 70 },

  { key: "International", label: "Student zagraniczny?", type: "select", options: map(yesNo) },

  { key: "Curricular units 1st sem (credited)", label: "Sem1 – uznane", type: "number" },
  { key: "Curricular units 1st sem (enrolled)", label: "Sem1 – zapisane", type: "number" },
  { key: "Curricular units 1st sem (evaluations)", label: "Sem1 – oceny", type: "number" },
  { key: "Curricular units 1st sem (approved)", label: "Sem1 – zaliczone", type: "number" },
  { key: "Curricular units 1st sem (grade)", label: "Sem1 – średnia (0-20)", type: "number", step: 0.1 },
  { key: "Curricular units 1st sem (without evaluations)", label: "Sem1 – bez ocen", type: "number" },

  { key: "Curricular units 2nd sem (credited)", label: "Sem2 – uznane", type: "number" },
  { key: "Curricular units 2nd sem (enrolled)", label: "Sem2 – zapisane", type: "number" },
  { key: "Curricular units 2nd sem (evaluations)", label: "Sem2 – oceny", type: "number" },
  { key: "Curricular units 2nd sem (approved)", label: "Sem2 – zaliczone", type: "number" },
  { key: "Curricular units 2nd sem (grade)", label: "Sem2 – średnia (0–20)", type: "number", step: 0.1 },
  { key: "Curricular units 2nd sem (without evaluations)", label: "Sem2 – bez ocen", type: "number" },

  { key: "Unemployment rate", label: "Bezrobocie (%)", type: "number", step: 0.1 },
  { key: "Inflation rate", label: "Inflacja (%)", type: "number", step: 0.1 },
  { key: "GDP", label: "PKB", type: "number", step: 0.1 },
]

export default function Survey() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<any>({})
  const [result, setResult] = useState<any>(null)

  const q = questions[step]
  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step])

  const update = (val: any) => {
    setData({ ...data, [q.key]: Number(val) })
  }

  const submit = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/predict/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model_name: MODEL_NAME,
        data,
      }),
    })
    setResult(await res.json())
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <MotionCard className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10">

        <CardHeader>
          <CardTitle>Ankieta AI</CardTitle>
          <CardDescription>Pytanie {step + 1} / {questions.length}</CardDescription>

          <div className="h-2 bg-white/10">
            <motion.div className="h-full bg-purple-500" animate={{ width: `${progress}%` }} />
          </div>
        </CardHeader>

        <CardContent>
  {!result ? (
    <AnimatePresence mode="wait">
      <motion.div
        key={q.key}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <Label className="text-lg">{q.label}</Label>

        {q.type === "select" ? (
          <div className="mt-3 space-y-2">
            {q.options.map((o: any) => {
              const selected = data[q.key] === o.value

              return (
                <button
                  type="button" // 🔥 kluczowe
                  key={o.value}
                  onClick={() => update(o.value)}
                  className={`
                    w-full p-3 rounded-xl border transition text-left
                    ${
                      selected
                        ? "bg-purple-500/30 border-purple-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  `}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
        ) : (
          <Input
            type="number"
            min={q.min}
            max={q.max}
            value={data[q.key] ?? ""} // 🔥 ważne
            onChange={(e) => update(e.target.value)}
            className="mt-3"
          />
        )}
      </motion.div>
    </AnimatePresence>
  ) : (
    <pre>{JSON.stringify(result, null, 2)}</pre>
  )}
</CardContent>
        <CardFooter className="flex justify-between">
          {!result ? (
            <>
              <Button disabled={step === 0} onClick={() => setStep(step - 1)}>Wstecz</Button>

              {step === questions.length - 1 ? (
                <Button onClick={submit}>Wyślij</Button>
              ) : (
                <Button onClick={() => setStep(step + 1)}>Dalej</Button>
              )}
            </>
          ) : (
            <Button onClick={() => location.reload()}>Jeszcze raz</Button>
          )}
        </CardFooter>

      </MotionCard>
    </div>
  )
}