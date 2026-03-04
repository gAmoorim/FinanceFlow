import Link from "next/link"
import Image from "next/image"
import {
  TrendingUp,
  ArrowRight,
  BarChart3,
  Shield,
  Target,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  {
    icon: BarChart3,
    label: "Controle total",
    description: "Gerencie entradas e despesas em um so lugar.",
  },
  {
    icon: Shield,
    label: "Seus dados seguros",
    description: "Autenticacao segura com token JWT.",
  },
  {
    icon: Target,
    label: "Metas financeiras",
    description: "Defina objetivos e acompanhe seu progresso.",
  },
  {
    icon: Zap,
    label: "Rapido e intuitivo",
    description: "Interface moderna e responsiva em qualquer tela.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[oklch(0.14_0.04_160)]">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-12 lg:py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            FinanceFlow
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Link href="/login">
              Acessar conta
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full font-semibold"
          >
            <Link href="/cadastro">
              Criar conta
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative flex flex-1 items-center overflow-hidden">
        {/* Background decorations */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[160px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />

        {/* Curved accent */}
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[55%] lg:block">
          <svg
            viewBox="0 0 800 900"
            fill="none"
            className="absolute -left-20 top-0 h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M200 0 Q50 450 200 900 L800 900 L800 0 Z"
              fill="oklch(0.18 0.05 160)"
              fillOpacity="0.5"
            />
          </svg>
        </div>

        <div className="relative z-10 flex w-full flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:gap-8 lg:px-12 lg:py-0">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-white/70">
                Feito para todo mundo
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
              Tudo que voce precisa para organizar suas{" "}
              <span className="text-primary">financas</span> de vez
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/50 lg:mx-0 lg:text-lg">
              O FinanceFlow simplifica o controle de receitas e despesas.
              Transforme a sua rotina financeira pessoal com praticidade.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="group h-13 rounded-full px-8 text-base font-semibold"
              >
                <Link href="/cadastro">
                  Comecar agora
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-13 rounded-full px-8 text-base text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">
                  Ja tenho conta
                </Link>
              </Button>
            </div>
          </div>

          {/* Right mockup */}
          <div className="relative flex-1 lg:flex lg:justify-end">
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              {/* Glow behind image */}
              <div className="absolute inset-0 translate-y-4 scale-95 rounded-3xl bg-primary/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <Image
                  src="dashboard.png"
                  alt="FinanceFlow dashboard mostrando controle financeiro"
                  width={600}
                  height={450}
                  className="h-auto w-full"
                  priority
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[oklch(0.18_0.04_160)] px-4 py-3 shadow-xl backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Saldo positivo</p>
                  <p className="text-xs text-white/50">Atualizado em tempo real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 border-t border-white/[0.06] bg-[oklch(0.12_0.03_160)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-start gap-4 px-6 py-8 lg:px-8"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/40">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[oklch(0.10_0.02_160)] px-6 py-6 text-center">
        <p className="text-xs text-white/30">
          FinanceFlow &mdash; Projeto open-source para fins educativos
        </p>
      </footer>
    </div>
  )
}
