// Recupera o valor de 'zaza' salvo no LocalStorage
let valorZaza = localStorage.getItem("valor");

// Se não houver valor, define como 0
if (valorZaza === null) {
    valorZaza = 0;
}

// Agora você pode usar o valorZaza para qualquer lógica, como exibir ou manipular
console.log("Valor de zaza:", valorZaza);

// Exemplo: Atualizando a quantidade em outra página
document.getElementById("outraTelaContador").textContent = valorZaza;
