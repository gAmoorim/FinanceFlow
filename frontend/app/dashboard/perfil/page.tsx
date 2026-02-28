"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { apiAtualizarUsuario, apiAtualizarSenha, apiDeletarUsuario } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Lock, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function PerfilPage() {
  const { user, refreshUser, logout } = useAuth()
  const router = useRouter()
  const [nome, setNome] = useState(user?.nome ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [loadingPerfil, setLoadingPerfil] = useState(false)
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoadingPerfil(true)
    try {
      await apiAtualizarUsuario(nome, email)
      await refreshUser()
      toast.success("Perfil atualizado com sucesso!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar perfil")
    } finally {
      setLoadingPerfil(false)
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas nao coincidem")
      return
    }
    if (novaSenha.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres")
      return
    }
    setLoadingSenha(true)
    try {
      await apiAtualizarSenha(novaSenha)
      setNovaSenha("")
      setConfirmarSenha("")
      toast.success("Senha atualizada com sucesso!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar senha")
    } finally {
      setLoadingSenha(false)
    }
  }

  async function handleDeleteAccount() {
    setLoadingDelete(true)
    try {
      await apiDeletarUsuario()
      toast.success("Conta excluida com sucesso")
      logout()
      router.push("/login")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir conta")
    } finally {
      setLoadingDelete(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informacoes pessoais</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Informacoes Pessoais</CardTitle>
              <CardDescription>Atualize seu nome e email</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome" className="text-foreground">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-11"
              />
            </div>
            <Button type="submit" className="self-start" disabled={loadingPerfil}>
              {loadingPerfil ? "Salvando..." : "Salvar alteracoes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Alterar Senha</CardTitle>
              <CardDescription>Defina uma nova senha para sua conta</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nova-senha" className="text-foreground">Nova senha</Label>
              <Input
                id="nova-senha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Minimo 6 caracteres"
                required
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmar-nova-senha" className="text-foreground">Confirmar nova senha</Label>
              <Input
                id="confirmar-nova-senha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a nova senha"
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="self-start" disabled={loadingSenha}>
              {loadingSenha ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Acoes irreversiveis para sua conta</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Ao excluir sua conta, todos os seus dados serao permanentemente removidos. Esta acao nao pode ser desfeita.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir minha conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Excluir conta permanentemente</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza absoluta? Todos os seus dados, transacoes e metas serao permanentemente excluidos. Esta acao nao pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {loadingDelete ? "Excluindo..." : "Sim, excluir minha conta"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
