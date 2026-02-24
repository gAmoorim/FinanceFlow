"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  Eye,
  EyeOff,
  ArrowRight,
  BarChart3,
  Target,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/[0.07] p-4 backdrop-blur-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-white/60">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, senha)
      toast.success("Login realizado com sucesso!")
      router.push("/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left brand panel */}
      <div className="relative hidden w-[52%] overflow-hidden bg-[oklch(0.14_0.04_160)] lg:flex lg:flex-col lg:justify-between">
        {/* Decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[100px]" />

        {/* Top logo */}
        <div className="relative z-10 flex items-center gap-2.5 px-10 pt-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              FinanceFlow
            </span>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-10">
          <div className="max-w-md">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Controle financeiro pessoal
            </p>
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-white text-balance">
              Suas financas em um so lugar, simples e direto.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/50">
              Acompanhe entradas e saidas, defina metas e tome decisoes mais
              inteligentes sobre seu dinheiro.
            </p>

            <div className="mt-10 flex flex-col gap-3">
              <FeatureCard
                icon={BarChart3}
                title="Resumo em tempo real"
                description="Veja entradas, saidas e saldo atualizado automaticamente."
              />
              <FeatureCard
                icon={Target}
                title="Metas financeiras"
                description="Defina objetivos e acompanhe seu progresso mes a mes."
              />
              <FeatureCard
                icon={Wallet}
                title="Transacoes detalhadas"
                description="Registre e filtre todas as suas movimentacoes."
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 px-10 pb-8">
          <p className="text-xs text-white/30">
            FinanceFlow &mdash; Projeto open-source
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            FinanceFlow
          </span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Bem-vindo de volta
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Entre com suas credenciais para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-lg bg-secondary/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="senha" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="h-11 rounded-lg bg-secondary/50 pr-10 text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="group mt-1 h-11 w-full rounded-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                "Entrando..."
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Nao tem uma conta?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Crie agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
