export type Amostra = {
  rpm?: number | null;
  vss?: number | null;
  ect?: number | null;
  vbat?: number | null;
  invalidos?: string[];
  gravando?: boolean;
};

export type EstadoConexao = 'conectando' | 'conectado' | 'desconectado';

type Avisos = {
  aoMudarEstado: (estado: EstadoConexao) => void;
  aoReceberAmostra: (amostra: Amostra) => void;
  aoPerderLogin: () => void;
};

// O backend fecha com 1008 quando nao ha login valido: reconectar nao resolve.
const SEM_LOGIN = 1008;
const ESPERA_RECONEXAO_MS = 1500;

export function urlDoWebSocket(servidor: string): string {
  return `${servidor.replace(/^http/, 'ws').replace(/\/+$/, '')}/ws`;
}

export function valorExibido(amostra: Amostra | null, campo: keyof Amostra, casas = 0): string {
  const valor = amostra?.[campo];
  if (typeof valor !== 'number' || amostra?.invalidos?.includes(campo)) return '--';
  return valor.toFixed(casas);
}

export type ResultadoLogin = { ok: true } | { ok: false; mensagem: string };

export async function entrar(servidor: string, email: string, senha: string): Promise<ResultadoLogin> {
  try {
    const resposta = await fetch(`${servidor.replace(/\/+$/, '')}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, senha }),
    });
    if (resposta.ok) return { ok: true };
    if (resposta.status === 401) return { ok: false, mensagem: 'E-mail ou senha incorretos.' };
    return { ok: false, mensagem: `O servidor respondeu com erro ${resposta.status}.` };
  } catch {
    return { ok: false, mensagem: 'Não consegui alcançar o servidor. Confira o endereço e o Wi-Fi.' };
  }
}

/** Abre o socket e reconecta sozinho. Devolve a funcao que encerra tudo. */
export function conectarTelemetria(servidor: string, avisos: Avisos): () => void {
  let ativo = true;
  let espera: ReturnType<typeof setTimeout> | undefined;
  let socket: WebSocket | undefined;

  function abrir() {
    avisos.aoMudarEstado('conectando');
    socket = new WebSocket(urlDoWebSocket(servidor));
    socket.onopen = () => avisos.aoMudarEstado('conectado');
    socket.onmessage = (evento) => {
      const { tipo, dados } = JSON.parse(String(evento.data));
      if (tipo === 'amostra') avisos.aoReceberAmostra(dados);
    };
    socket.onclose = (evento) => {
      if (!ativo) return;
      if (evento.code === SEM_LOGIN) {
        avisos.aoPerderLogin();
        return;
      }
      avisos.aoMudarEstado('desconectado');
      espera = setTimeout(abrir, ESPERA_RECONEXAO_MS);
    };
  }

  abrir();
  return () => {
    ativo = false;
    clearTimeout(espera);
    socket?.close();
  };
}
