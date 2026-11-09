import { useEffect, useState } from 'react';
import { Amostra, EstadoConexao, conectarTelemetria } from '../lib/telemetria';

export function useTelemetria(servidor: string | null, aoPerderLogin: () => void) {
  const [estado, setEstado] = useState<EstadoConexao>('conectando');
  const [amostra, setAmostra] = useState<Amostra | null>(null);
  const [chegouEm, setChegouEm] = useState<number | null>(null);
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    if (!servidor) return;
    return conectarTelemetria(servidor, {
      aoMudarEstado: setEstado,
      aoPerderLogin,
      aoReceberAmostra: (nova) => {
        setAmostra(nova);
        setChegouEm(Date.now());
      },
    });
  }, [servidor, aoPerderLogin]);

  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), 250);
    return () => clearInterval(relogio);
  }, []);

  const segundosSemLeitura = chegouEm === null ? null : Math.max(0, (agora - chegouEm) / 1000);
  return { estado, amostra, segundosSemLeitura };
}
