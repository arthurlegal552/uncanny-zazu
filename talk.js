const fala = document.getElementById("fala");
const frases = ["yo", "are you still up?", "how about get more zazas?", "whatever"];
let index = 0;

setInterval(() => {
    fala.textContent = frases[index];  // Atualiza a fala
    index = (index + 1) % frases.length;  // Muda para a próxima frase
}, 20000);  // 20 segundos
