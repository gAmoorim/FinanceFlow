"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { apiLogin, apiCadastro, apiObterUsuario, setToken, removeToken } from "@/lib/api"

interface User {
  nome: string
  email: string
  criado_em?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  cadastro: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiObterUsuario()
      setUser({ nome: data.usuario, email: data.email, criado_em: data.criado_em })
    } catch {
      setUser(null)
      removeToken()
    }
  }, [])

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("financeflow_token") : null
    if (token) {
      refreshUser().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [refreshUser])

  const login = async (email: string, senha: string) => {
    const data = await apiLogin(email, senha)
    setToken(data.token)
    setUser({
      nome: data.usuario.nome,
      email: data.usuario.email,
      criado_em: data.usuario.criado_em,
    })
  }

  const cadastro = async (nome: string, email: string, senha: string) => {
    await apiCadastro(nome, email, senha)
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, cadastro, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
