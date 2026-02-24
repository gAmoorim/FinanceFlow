"use client"

import useSWR from "swr"
import { apiResumoTransacoes, apiListarTransacoes, apiListarMetas } from "@/lib/api"
import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function SummaryCards() {
  const { data, isLoading } = useSWR("resumo", apiResumoTransacoes)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: "Entradas",
      value: data?.entradas ?? 0,
      icon: TrendingUp,
      iconColor: "text-primary",
      bgColor: "bg-accent",
    },
    {
      label: "Saidas",
      value: data?.saidas ?? 0,
      icon: TrendingDown,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Saldo",
      value: data?.saldo ?? 0,
      icon: Wallet,
      iconColor: (data?.saldo ?? 0) >= 0 ? "text-primary" : "text-destructive",
      bgColor: (data?.saldo ?? 0) >= 0 ? "bg-accent" : "bg-destructive/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(card.value)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecentTransactions() {
  const { data, isLoading } = useSWR("transacoes-recentes", () => apiListarTransacoes())

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Transacoes Recentes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const transacoes = (data ?? []).slice(0, 7)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Transacoes Recentes</CardTitle>
          <CardDescription>Suas ultimas movimentacoes</CardDescription>
        </div>
        <Link href="/dashboard/transacoes">
          <Button variant="ghost" size="sm" className="text-primary">
            Ver todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {transacoes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma transacao registrada ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {transacoes.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg p-3 bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                      t.tipo === "entrada" ? "bg-accent" : "bg-destructive/10"
                    }`}
                  >
                    {t.tipo === "entrada" ? (
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.descricao}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(t.criado_em)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      t.tipo === "entrada" ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {t.tipo === "entrada" ? "+" : "-"} {formatCurrency(Number(t.valor))}
                  </p>
                  <Badge variant={t.tipo === "entrada" ? "default" : "destructive"} className="text-xs">
                    {t.tipo}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function GoalsSummary() {
  const { data, isLoading } = useSWR("metas-resumo", apiListarMetas)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Metas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const metas = (data?.metas ?? []).slice(0, 4)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Metas Financeiras</CardTitle>
          <CardDescription>Progresso das suas metas</CardDescription>
        </div>
        <Link href="/dashboard/metas">
          <Button variant="ghost" size="sm" className="text-primary">
            Ver todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {metas.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma meta definida ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {metas.map((meta) => {
              const percentage = Math.min(
                Math.round((Number(meta.valor_atual) / Number(meta.valor_alvo)) * 100),
                100
              )
              return (
                <div key={meta.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{meta.titulo}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(Number(meta.valor_atual))}</span>
                    <span>{formatCurrency(Number(meta.valor_alvo))}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visao geral das suas financas</p>
      </div>
      <SummaryCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTransactions />
        <GoalsSummary />
      </div>
    </div>
  )
}
