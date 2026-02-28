"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  apiListarTransacoes,
  apiCriarTransacao,
  apiAtualizarTransacao,
  apiExcluirTransacao,
  type Transacao,
} from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, ArrowUpRight, ArrowDownRight, Filter, X } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

function TransactionForm({
  initialData,
  onSubmit,
  loading,
}: {
  initialData?: Transacao
  onSubmit: (descricao: string, valor: number, tipo: "entrada" | "despesa") => Promise<void>
  loading: boolean
}) {
  const [descricao, setDescricao] = useState(initialData?.descricao ?? "")
  const [valor, setValor] = useState(initialData ? String(initialData.valor) : "")
  const [tipo, setTipo] = useState<"entrada" | "despesa">(initialData?.tipo ?? "entrada")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(descricao, Number(valor), tipo)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="descricao" className="text-foreground">Descricao</Label>
        <Input
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Salario, Aluguel, Supermercado..."
          required
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="valor" className="text-foreground">Valor (R$)</Label>
        <Input
          id="valor"
          type="number"
          step="0.01"
          min="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
          required
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-foreground">Tipo</Label>
        <Select value={tipo} onValueChange={(v) => setTipo(v as "entrada" | "despesa")}>
          <SelectTrigger className="h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entrada">Entrada</SelectItem>
            <SelectItem value="despesa">Despesa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="h-11 mt-2" disabled={loading}>
        {loading ? "Salvando..." : initialData ? "Atualizar" : "Criar transacao"}
      </Button>
    </form>
  )
}

export default function TransacoesPage() {
  const [filtroTipo, setFiltroTipo] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transacao | null>(null)
  const [loading, setLoading] = useState(false)

  const filtros = filtroTipo && filtroTipo !== "todos" ? { tipo: filtroTipo } : {}
  const { data, isLoading, mutate } = useSWR(
    ["transacoes", filtros],
    () => apiListarTransacoes(filtros),
    { keepPreviousData: true }
  )

  async function handleCreate(descricao: string, valor: number, tipo: "entrada" | "despesa") {
    setLoading(true)
    try {
      await apiCriarTransacao(descricao, valor, tipo)
      toast.success("Transacao criada com sucesso!")
      setCreateOpen(false)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar transacao")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(descricao: string, valor: number, tipo: "entrada" | "despesa") {
    if (!selectedTransaction) return
    setLoading(true)
    try {
      await apiAtualizarTransacao(selectedTransaction.id, descricao, valor, tipo)
      toast.success("Transacao atualizada!")
      setEditOpen(false)
      setSelectedTransaction(null)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar transacao")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!selectedTransaction) return
    setLoading(true)
    try {
      await apiExcluirTransacao(selectedTransaction.id)
      toast.success("Transacao excluida!")
      setDeleteOpen(false)
      setSelectedTransaction(null)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir transacao")
    } finally {
      setLoading(false)
    }
  }

  const transacoes = data ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transacoes</h1>
          <p className="text-muted-foreground">Gerencie suas entradas e despesas</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary text-primary" : ""}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova transacao
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-foreground">Nova Transacao</DialogTitle>
                <DialogDescription>Preencha os dados da nova transacao</DialogDescription>
              </DialogHeader>
              <TransactionForm onSubmit={handleCreate} loading={loading} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-foreground">Tipo:</Label>
              <Select value={filtroTipo || "todos"} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="entrada">Entradas</SelectItem>
                  <SelectItem value="despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filtroTipo && filtroTipo !== "todos" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiltroTipo("")}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            {transacoes.length} transacao{transacoes.length !== 1 ? "es" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : transacoes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma transacao encontrada.</p>
              <Button variant="link" className="mt-2 text-primary" onClick={() => setCreateOpen(true)}>
                Criar primeira transacao
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">Descricao</TableHead>
                      <TableHead className="text-muted-foreground">Tipo</TableHead>
                      <TableHead className="text-right text-muted-foreground">Valor</TableHead>
                      <TableHead className="text-muted-foreground">Data</TableHead>
                      <TableHead className="text-right text-muted-foreground">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transacoes.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium text-foreground">{t.descricao}</TableCell>
                        <TableCell>
                          <Badge variant={t.tipo === "entrada" ? "default" : "destructive"}>
                            {t.tipo === "entrada" ? (
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 mr-1" />
                            )}
                            {t.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            t.tipo === "entrada" ? "text-primary" : "text-destructive"
                          }`}
                        >
                          {t.tipo === "entrada" ? "+" : "-"} {formatCurrency(Number(t.valor))}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDateTime(t.criado_em)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => { setSelectedTransaction(t); setEditOpen(true) }}
                              aria-label="Editar transacao"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => { setSelectedTransaction(t); setDeleteOpen(true) }}
                              aria-label="Excluir transacao"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden flex flex-col gap-2">
                {transacoes.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg p-3 bg-muted/50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`flex shrink-0 items-center justify-center w-9 h-9 rounded-lg ${
                          t.tipo === "entrada" ? "bg-accent" : "bg-destructive/10"
                        }`}
                      >
                        {t.tipo === "entrada" ? (
                          <ArrowUpRight className="w-4 h-4 text-primary" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{t.descricao}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(t.criado_em)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          t.tipo === "entrada" ? "text-primary" : "text-destructive"
                        }`}
                      >
                        {t.tipo === "entrada" ? "+" : "-"}{formatCurrency(Number(t.valor))}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => { setSelectedTransaction(t); setEditOpen(true) }}
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => { setSelectedTransaction(t); setDeleteOpen(true) }}
                        aria-label="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) setSelectedTransaction(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Transacao</DialogTitle>
            <DialogDescription>Atualize os dados da transacao</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <TransactionForm
              initialData={selectedTransaction}
              onSubmit={handleUpdate}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setSelectedTransaction(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Excluir transacao</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a transacao &quot;{selectedTransaction?.descricao}&quot;? Esta acao nao pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
