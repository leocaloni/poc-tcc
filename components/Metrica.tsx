import { StyleSheet, Text, View } from 'react-native';

export function Metrica({ rotulo, valor, unidade }: { rotulo: string; valor: string; unidade: string }) {
  return (
    <View style={estilos.cartao}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={estilos.valor}>{valor}</Text>
      <Text style={estilos.rotulo}>{unidade}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { width: '48%', backgroundColor: '#161a24', borderRadius: 8, padding: 16, marginBottom: 12 },
  rotulo: { color: '#a0a0a0', fontSize: 14 },
  valor: { color: '#ff8a1f', fontSize: 40, fontWeight: '700' },
});
