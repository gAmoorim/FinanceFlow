"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  apiListarMetas,
  apiCriarMeta,
  apiAtualizarMeta,
  apiExcluirMeta,
  type Meta,
} from "@/lib/api"
import { formatCurrency, MESES } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, Target, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

function MetaForm({
  initialData,
  onSubmit,
  loading,
}: {
  initialData?: Meta
  onSubmit: (titulo: string, valor_atual: number, valor_alvo: number, mes: number, ano: number) => Promise<void>
  loading: boolean
}) {
  const [titulo, setTitulo] = useState(initialData?.titulo ?? "")
  const [valorAtual, setValorAtual] = useState(initialData ? String(initialData.valor_atual) : "0")
  const [valorAlvo, setValorAlvo] = useState(initialData ? String(initialData.valor_alvo) : "")
  const [mes, setMes] = useState(initialData ? String(initialData.mes) : String(new Date().getMonth() + 1))
  const [ano, setAno] = useState(initialData ? String(initialData.ano) : String(new Date().getFullYear()))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(titulo, Number(valorAtual), Number(valorAlvo), Number(mes), Number(ano))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="titulo" className="text-foreground">Titulo da meta</Label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Reserva de emergencia, Viagem..."
          required
          className="h-11"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="valor_atual" className="text-foreground">Valor atual (R$)</Label>
          <Input
            id="valor_atual"
            type="number"
            step="0.01"
            min="0"
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="valor_alvo" className="text-foreground">Valor alvo (R$)</Label>
          <Input
            id="valor_alvo"
            type="number"
            step="0.01"
            min="0.01"
            value={valorAlvo}
            onChange={(e) => setValorAlvo(e.target.value)}
            required
            className="h-11"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-foreground">Mes</Label>
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((nome, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ano" className="text-foreground">Ano</Label>
          <Input
            id="ano"
            type="number"
            min="2020"
            max="2030"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            required
            className="h-11"
          />
        </div>
      </div>
      <Button type="submit" className="h-11 mt-2" disabled={loading}>
        {loading ? "Salvando..." : initialData ? "Atualizar meta" : "Criar meta"}
      </Button>
    </form>
  )
}

export default function MetasPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedMeta, setSelectedMeta] = useState<Meta | null>(null)
  const [loading, setLoading] = useState(false)

  const { data, isLoading, mutate } = useSWR("metas", apiListarMetas)

  async function handleCreate(titulo: string, valor_atual: number, valor_alvo: number, mes: number, ano: number) {
    setLoading(true)
    try {
      await apiCriarMeta(titulo, valor_atual, valor_alvo, mes, ano)
      toast.success("Meta criada com sucesso!")
      setCreateOpen(false)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar meta")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(titulo: string, valor_atual: number, valor_alvo: number, mes: number, ano: number) {
    if (!selectedMeta) return
    setLoading(true)
    try {
      await apiAtualizarMeta(selectedMeta.id, titulo, valor_atual, valor_alvo, mes, ano)
      toast.success("Meta atualizada!")
      setEditOpen(false)
      setSelectedMeta(null)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar meta")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!selectedMeta) return
    setLoading(true)
    try {
      await apiExcluirMeta(selectedMeta.id)
      toast.success("Meta excluida!")
      setDeleteOpen(false)
      setSelectedMeta(null)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir meta")
    } finally {
      setLoading(false)
    }
  }

  const metas = data?.metas ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Metas Financeiras</h1>
          <p className="text-muted-foreground">Defina e acompanhe suas metas</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nova meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">Nova Meta</DialogTitle>
              <DialogDescription>Defina uma nova meta financeira</DialogDescription>
            </DialogHeader>
            <MetaForm onSubmit={handleCreate} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-5 w-40 mb-4" />
                <Skeleton className="h-3 w-full mb-3" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : metas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-2">Nenhuma meta definida ainda.</p>
            <Button variant="link" className="text-primary" onClick={() => setCreateOpen(true)}>
              Criar primeira meta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metas.map((meta) => {
            const percentage = Math.min(
              Math.round((Number(meta.valor_atual) / Number(meta.valor_alvo)) * 100),
              100
            )
            const isComplete = percentage >= 100
            return (
              <Card key={meta.id} className={isComplete ? "border-primary/30 bg-accent/30" : ""}>
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${isComplete ? "bg-primary" : "bg-accent"}`}>
                      {isComplete ? (
                        <TrendingUp className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Target className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base text-foreground">{meta.titulo}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {MESES[(meta.mes ?? 1) - 1]} {meta.ano}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => { setSelectedMeta(meta); setEditOpen(true) }}
                      aria-label="Editar meta"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => { setSelectedMeta(meta); setDeleteOpen(true) }}
                      aria-label="Excluir meta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className={`font-semibold ${isComplete ? "text-primary" : "text-foreground"}`}>
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2.5" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(Number(meta.valor_atual))}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(Number(meta.valor_alvo))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setSelectedMeta(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Meta</DialogTitle>
            <DialogDescription>Atualize os dados da meta</DialogDescription>
          </DialogHeader>
          {selectedMeta && (
            <MetaForm
              initialData={selectedMeta}
              onSubmit={handleUpdate}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setSelectedMeta(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Excluir meta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a meta &quot;{selectedMeta?.titulo}&quot;? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
