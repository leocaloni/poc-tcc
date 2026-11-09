# Critérios de aceitação

- [x] Depois do login, RPM, velocidade, temperatura e bateria mudam na tela a cada amostra, com o backend rodando em `--sim`.
- [x] A linha "Última leitura há X s" volta para perto de zero a cada amostra e não passa de 2 s enquanto o backend está no ar.
- [x] Com senha errada, aparece "E-mail ou senha incorretos." e nenhum dado é exibido.
- [x] Com o endereço errado ou o servidor fora do ar, aparece "Não consegui alcançar o servidor. Confira o endereço e o Wi-Fi.".
- [x] Um campo marcado como inválido pelo backend aparece como "--", nunca como 0 ou como o valor anterior.
- [x] Ao derrubar o backend, a tela mostra "Desconectado, tentando de novo..." em até 5 s; ao religar, os dados voltam sem reabrir o app.

**Verificado em:** (x) aparelho físico ( ) emulador
**Resultado:** (x) passou ( ) reprovou
