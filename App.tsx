import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Metrica } from './components/Metrica';
import { useTelemetria } from './hooks/useTelemetria';
import { entrar, valorExibido } from './lib/telemetria';

const TEXTO_ESTADO = { conectando: 'Conectando...', conectado: 'Conectado', desconectado: 'Desconectado, tentando de novo...' };

export default function App() {
  const [endereco, setEndereco] = useState('http://192.168.0.10:8000');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [servidor, setServidor] = useState<string | null>(null);

  const aoPerderLogin = useCallback(() => {
    setServidor(null);
    setErro('Sessão inválida. Faça login de novo.');
  }, []);
  const { estado, amostra, segundosSemLeitura } = useTelemetria(servidor, aoPerderLogin);

  async function aoEntrar() {
    setErro('');
    const resultado = await entrar(endereco, email, senha);
    if (resultado.ok) setServidor(endereco);
    else setErro(resultado.mensagem);
  }

  if (!servidor) {
    return (
      <View style={estilos.tela}>
        <StatusBar style="light" />
        <Text style={estilos.titulo}>Telemetria ao vivo</Text>
        <TextInput style={estilos.campo} value={endereco} onChangeText={setEndereco} autoCapitalize="none" placeholder="Servidor" placeholderTextColor="#777" />
        <TextInput style={estilos.campo} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="E-mail" placeholderTextColor="#777" />
        <TextInput style={estilos.campo} value={senha} onChangeText={setSenha} secureTextEntry placeholder="Senha" placeholderTextColor="#777" />
        <Pressable style={estilos.botao} onPress={aoEntrar}><Text style={estilos.textoBotao}>Entrar</Text></Pressable>
        {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />
      <Text style={estilos.titulo}>Telemetria ao vivo</Text>
      <Text style={estilos.estado}>{TEXTO_ESTADO[estado]}</Text>
      <Text style={estilos.estado}>
        {segundosSemLeitura === null ? 'Aguardando a primeira leitura' : `Última leitura há ${segundosSemLeitura.toFixed(1)} s`}
      </Text>
      <View style={estilos.grade}>
        <Metrica rotulo="RPM" valor={valorExibido(amostra, 'rpm')} unidade="rpm" />
        <Metrica rotulo="Velocidade" valor={valorExibido(amostra, 'vss')} unidade="km/h" />
        <Metrica rotulo="Temperatura" valor={valorExibido(amostra, 'ect')} unidade="°C" />
        <Metrica rotulo="Bateria" valor={valorExibido(amostra, 'vbat', 1)} unidade="V" />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#07080b', padding: 20, paddingTop: 64 },
  titulo: { color: '#f2f2f0', fontSize: 26, fontWeight: '700', marginBottom: 16 },
  campo: { backgroundColor: '#161a24', color: '#f2f2f0', borderRadius: 8, padding: 14, marginBottom: 12 },
  botao: { backgroundColor: '#ff8a1f', borderRadius: 8, padding: 14, alignItems: 'center' },
  textoBotao: { color: '#07080b', fontWeight: '700' },
  erro: { color: '#ff6b6b', marginTop: 12 },
  estado: { color: '#a0a0a0', marginBottom: 6 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
});
