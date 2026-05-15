"use client"

import { motion } from "motion/react"
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
  Sparkles,
  Rocket,
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

const architecture = [
  {
    icon: Cloud,
    text: "Azure Storage dla plików i modeli",
  },
  {
    icon: Database,
    text: "Baza danych dla metadanych i konfiguracji",
  },
  {
    icon: Server,
    text: "Backend API obsługujący ETL i ML",
  },
  {
    icon: Brain,
    text: "Modele predykcyjne trenowane na danych",
  },
  {
    icon: BarChart3,
    text: "Dashboard frontendowy dla użytkownika",
  },
]

const pageVariants = {
  hidden: {
    opacity: 0,
  },

  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 46,
    scale: 0.94,
    filter: "blur(8px)",
  },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",

    transition: {
      type: "spring",
      stiffness: 210,
      damping: 22,
      mass: 0.9,
    },
  },
}

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      type: "spring",
      stiffness: 230,
      damping: 24,
      mass: 0.75,
      delay: 0.16,
    },
  },
}

const listVariants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.94,
  },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      type: "spring",
      stiffness: 330,
      damping: 24,
      mass: 0.7,
    },
  },
}

const badgeVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.85,
  },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      type: "spring",
      stiffness: 420,
      damping: 22,
    },
  },
}

function AnimatedCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 24,
      }}
      className={className}
    >
      <Card className="relative h-full overflow-hidden rounded-3xl border-border/60 bg-background/75 shadow-xl shadow-black/5 backdrop-blur-xl">
        {children}
      </Card>
    </motion.div>
  )
}

export default function AboutTab() {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-6"
    >
      {/* LEFT */}
      <div className="col-span-2 space-y-6">
        {/* ABOUT */}
        <AnimatedCard>
          <CardHeader>
            <motion.div variants={contentVariants}>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} />
                About Project
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.div
              variants={contentVariants}
              className="space-y-4 text-sm text-muted-foreground leading-relaxed"
            >
              <p>
                Projekt przedstawia kompletną platformę analityczną typu
                MLOps, której celem jest obsługa procesu pracy z danymi:
                od załadowania plików, przez przetwarzanie ETL, aż po
                trenowanie modeli predykcyjnych i zarządzanie ich wersjami.
              </p>

              <p>
                System został przygotowany w ramach projektu zespołowego
                z zakresu hurtowni danych oraz metod analitycznych.
                Aplikacja umożliwia odtworzenie pełnego przepływu danych
                w czystym środowisku oraz prezentuje wyniki
                w formie dashboardu.
              </p>

              <motion.div
                variants={listVariants}
                className="flex flex-wrap gap-2 pt-2"
              >
                {[
                  "Data Warehouse",
                  "ETL",
                  "Machine Learning",
                  "MLOps",
                  "Dashboard",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    variants={badgeVariants}
                  >
                    <Badge
                      variant={index === 0 ? "default" : "outline"}
                    >
                      {item}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </CardContent>
        </AnimatedCard>

        {/* FEATURES */}
        <AnimatedCard>
          <CardHeader>
            <motion.div variants={contentVariants}>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle size={18} />
                Functionalities
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.div
              variants={listVariants}
              className="grid grid-cols-2 gap-3"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature}
                  variants={itemVariants}
                  className="
                    flex
                    items-start
                    gap-2
                    rounded-2xl
                    border
                    bg-background/70
                    p-3
                    text-sm
                    shadow-sm
                  "
                >
                  <CheckCircle
                    size={16}
                    className="mt-0.5 text-green-500"
                  />

                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* RIGHT */}
      <div className="space-y-6">
        {/* STACK */}
        <AnimatedCard>
          <CardHeader>
            <motion.div variants={contentVariants}>
              <CardTitle className="flex items-center gap-2">
                <Code2 size={18} />
                Tech Stack
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.div
              variants={listVariants}
              className="flex flex-wrap gap-2"
            >
              {stack.map((item) => (
                <motion.div
                  key={item}
                  variants={badgeVariants}
                >
                  <Badge variant="secondary">
                    {item}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </AnimatedCard>

        {/* ARCHITECTURE */}
        <AnimatedCard>
          <CardHeader>
            <motion.div variants={contentVariants}>
              <CardTitle className="flex items-center gap-2">
                <GitBranch size={18} />
                Architecture
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.div
              variants={listVariants}
              className="space-y-3 text-sm"
            >
              {architecture.map((item) => {
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.text}
                    variants={itemVariants}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      bg-background/60
                      p-3
                    "
                  >
                    <div
                      className="
                        rounded-xl
                        bg-primary/10
                        p-2
                        text-primary
                      "
                    >
                      <Icon size={16} />
                    </div>

                    <span>{item.text}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </CardContent>
        </AnimatedCard>

        {/* SCOPE */}
        <AnimatedCard>
          <CardHeader>
            <motion.div variants={contentVariants}>
              <CardTitle className="flex items-center gap-2">
                <Rocket size={18} />
                Assessment Scope
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.div
              variants={contentVariants}
              className="space-y-4 text-sm text-muted-foreground"
            >
              <p>
                Projekt spełnia wymagania obejmujące bazę danych,
                pipeline ETL, model predykcyjny, dashboard oraz
                elementy MLOps.
              </p>

              <motion.div variants={badgeVariants}>
                <Badge className="gap-1.5">
                  <Sparkles size={13} />
                  Target grade: db / db+
                </Badge>
              </motion.div>
            </motion.div>
          </CardContent>
        </AnimatedCard>
      </div>
    </motion.div>
  )
}