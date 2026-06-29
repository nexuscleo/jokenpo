# ✊ Jokenpô Premium - Vs CPU & Multiplayer Local

Este é um projeto moderno e responsivo do clássico jogo **Jokenpô (Pedra, Papel e Tesoura)**. Desenvolvido com HTML5 semântico, CSS3 customizado e JavaScript puro (Vanilla JS), o jogo oferece uma experiência visual premium através de efeitos de vidro (glassmorphism), animações dinâmicas e persistência local de dados.

O projeto foi projetado seguindo as melhores práticas de Clean Code, contendo separação rígida de responsabilidades para permitir testes unitários automatizados.

---

## 🌟 Principais Recursos

1. **Modo Contra CPU (Singleplayer):** O jogador joga contra uma inteligência artificial que gera escolhas pseudo-aleatórias.
2. **Modo 2 Jogadores (Multiplayer Local - Pass and Play):** Sistema de turnos onde o Jogador 1 faz sua escolha, que é ocultada por um cadeado (`🔒`) para que o Jogador 2 não a veja. O jogo apenas revela os emojis e calcula o resultado após ambos escolherem.
3. **Animação de Suspense (Sacudida de Punhos):** Movimentação de sacudir os punhos (`✊`) por 500ms simulando o gesto real de Jokenpô antes da revelação dos movimentos escolhidos.
4. **Persistência com LocalStorage:** As pontuações e o modo de jogo selecionado são salvos automaticamente no navegador, carregados ao iniciar e mantidos independentemente (o placar da CPU não afeta o PvP).
5. **Responsividade Estrita:** Ajustado para se enquadrar 100% no viewport sem barras de rolagem vertical, com redimensionamento de elementos proporcional em telas móveis.

---

## 🛠️ Arquitetura e Padrões de Código

### JavaScript (ES6+)

O código em [script.js](script.js) foi escrito utilizando recursos modernos do ECMAScript, com destaque para:

* **Destructuring (Desestruturação):**
  * **Atribuição Simplificada:** Usado no carregamento de objetos a partir do `localStorage` (ex: `const { cpu, pvp, mode } = JSON.parse(...)`).
  * **Mapeamento de Regras:** Utilizado na determinação dinâmica do vencedor com computed property name (propriedades computadas), eliminando condicionais redundantes:
    ```javascript
    const { [p1]: winsAgainst } = WIN_CONDITIONS;
    if (winsAgainst === p2) return 'win';
    ```
* **Isomorfismo e Isolamento do DOM:**
  O script foi projetado para rodar em múltiplos ambientes. Variáveis globais do navegador como `document` e `localStorage` são acessadas através de funções de guarda (`typeof document !== 'undefined'`). Isso garante que a lógica de negócio pura do jogo possa ser importada no Node.js por frameworks de teste sem lançar erros de referência.
* **Prevenção de Condições de Corrida (Race Conditions):**
  Durante a animação de sacudida (500ms), o estado `state.isAnimating` é ativado e todos os botões de ação são desabilitados via JavaScript para evitar spam e garantir a integridade dos cálculos de rodada.

### CSS (Design System & Glassmorphism)

O arquivo [style.css](style.css) segue uma abordagem moderna baseada em Design Tokens (variáveis CSS):

* **Glassmorphism:** Efeito translúcido utilizando `backdrop-filter: blur(24px)` e cores de fundo baseadas em HSL transparentes com sombras projetadas suaves.
* **Transições e Animações CSS:**
  * `@keyframes float`: Efeito de flutuação vertical contínuo e sutil nos emojis da arena.
  * `@keyframes shake-left`/`shake-right`: Sacudidas de punhos em direções opostas com transição `cubic-bezier`.
  * **Pulso Neon:** Classes dinâmicas de vitória (`player-winner-active`, `cpu-winner-active`, `draw-active`) que aplicam bordas sólidas brilhantes e sombras neon coloridas na coluna do vencedor da rodada.

---

## 🧪 Estrutura de Testes Unitários (Jest)

A lógica central do jogo foi isolada para permitir testes automatizados e robustos sem a necessidade de simular elementos HTML ou mexer na árvore do DOM.

### Funções Testadas:
* `determineWinner(p1, p2)`: Cobre 100% dos cenários (Vitórias do P1, derrotas e todos os empates possíveis).
* `playMachine()`: Garante que a IA retorne valores válidos dentro do array de escolhas.
* Mapeamento estrutural (`WIN_CONDITIONS` e `CHOICE_EMOJI`).

### Configuração do Ambiente de Teste (Exemplo de Instalação):

Para rodar os testes localmente em ambiente de desenvolvimento:
1. Instale o Jest como dependência de desenvolvimento:
   ```bash
   npm install jest --save-dev
   ```
2. Adicione o script de testes no `package.json`:
   ```json
   "scripts": {
     "test": "jest"
   }
   ```
3. Execute o comando de testes:
   ```bash
   npm test
   ```

O arquivo de testes `script.test.js` utiliza exportações condicionais (`module.exports`) presentes no final de `script.js` para realizar a importação de maneira segura no ambiente Node.

---

## 📂 Estrutura de Arquivos

```text
├── index.html       # Estrutura do jogo, cabeçalho, seletor de modos e arena.
├── style.css        # Variáveis CSS, layout flexbox/grid, responsividade e animações.
└── script.js        # Lógica de estados, persistência, multiplayer local e turnos.
```

---

## 🚀 Como Executar o Projeto

1. Faça o clone ou download deste repositório.
2. Abra o arquivo `index.html` diretamente em qualquer navegador moderno.
3. Escolha o modo de jogo no interruptor do topo e divirta-se!
