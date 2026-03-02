const API_URL = process.env.NEXT_PUBLIC_API_URL

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("financeflow_token")
}

export function setToken(token: string) {
  localStorage.setItem("financeflow_token", token)
}

export function removeToken() {
  localStorage.removeItem("financeflow_token")
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (res.status === 204) {
    return {} as T
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || data.mensagem || "Erro na requisicao")
  }

  return data
}

// Auth
export async function apiCadastro(nome: string, email: string, senha: string) {
  return request<{ mensagem: string; usuario: { nome: string; email: string } }>(
    "/cadastro",
    { method: "POST", body: JSON.stringify({ nome, email, senha }) }
  )
}

export async function apiLogin(email: string, senha: string) {
  return request<{
    usuario: { id: number; nome: string; email: string; criado_em: string }
    token: string
  }>("/login", { method: "POST", body: JSON.stringify({ email, senha }) })
}

// User
export async function apiObterUsuario() {
  return request<{ usuario: string; email: string; criado_em: string }>("/usuario")
}

export async function apiAtualizarUsuario(nome?: string, email?: string) {
  return request<{ mensagem: string; usuario: { nome: string; email: string } }>(
    "/usuario",
    { method: "PUT", body: JSON.stringify({ nome, email }) }
  )
}

export async function apiAtualizarSenha(novasenha: string) {
  return request<{ mensagem: string }>("/atualizarsenha", {
    method: "PUT",
    body: JSON.stringify({ novasenha }),
  })
}

export async function apiDeletarUsuario() {
  return request<{ mensagem: string }>("/usuario", { method: "DELETE" })
}

// Transactions
export interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: "entrada" | "despesa"
  criado_em: string
  user_id: number
}

export interface ResumoTransacoes {
  entradas: number
  saidas: number
  saldo: number
}

export async function apiListarTransacoes(filtros?: {
  data_inicio?: string
  data_fim?: string
  tipo?: string
}) {
  const params = new URLSearchParams()
  if (filtros?.data_inicio) params.set("data_inicio", filtros.data_inicio)
  if (filtros?.data_fim) params.set("data_fim", filtros.data_fim)
  if (filtros?.tipo) params.set("tipo", filtros.tipo)
  const query = params.toString() ? `?${params.toString()}` : ""
  return request<Transacao[]>(`/transacoes${query}`)
}

export async function apiCriarTransacao(
  descricao: string,
  valor: number,
  tipo: "entrada" | "despesa"
) {
  return request<{ mensagem: string; transacao: { descricao: string; valor: number; tipo: string } }>(
    "/transacoes",
    { method: "POST", body: JSON.stringify({ descricao, valor, tipo }) }
  )
}

export async function apiAtualizarTransacao(
  id: number,
  descricao?: string,
  valor?: number,
  tipo?: string
) {
  return request<{ mensagem: string }>(`/transacoes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ descricao, valor, tipo }),
  })
}

export async function apiExcluirTransacao(id: number) {
  return request<{ mensagem: string }>(`/transacoes/${id}`, { method: "DELETE" })
}

export async function apiResumoTransacoes() {
  return request<ResumoTransacoes>("/transacoes/resumo")
}

// Goals (Metas)
export interface Meta {
  id: number
  titulo: string
  valor_atual: number
  valor_alvo: number
  mes: number
  ano: number
  user_id: number
  criado_em?: string
}

export async function apiListarMetas() {
  return request<{ mensagem: string; metas: Meta[] }>("/metas")
}

export async function apiCriarMeta(
  titulo: string,
  valor_atual: number,
  valor_alvo: number,
  mes: number,
  ano: number
) {
  return request<{ mensagem: string; meta: Meta }>("/metas", {
    method: "POST",
    body: JSON.stringify({ titulo, valor_atual, valor_alvo, mes, ano }),
  })
}

export async function apiAtualizarMeta(
  id: number,
  titulo?: string,
  valor_atual?: number,
  valor_alvo?: number,
  mes?: number,
  ano?: number
) {
  return request<{ mensagem: string; meta: Meta }>(`/metas/${id}`, {
    method: "PUT",
    body: JSON.stringify({ titulo, valor_atual, valor_alvo, mes, ano }),
  })
}

export async function apiExcluirMeta(id: number) {
  return request<{ mensagem: string }>(`/metas/${id}`, { method: "DELETE" })
}
