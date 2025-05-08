// Carrega os dados ao iniciar
document.addEventListener("DOMContentLoaded", () => {
    const valorSalvo = parseInt(localStorage.getItem("valor")) || 0;
    document.getElementById("outraTelaContador").textContent = valorSalvo;
    atualizarInventario();
    verificarCompra();
});

// Verifica se o item já foi comprado
function verificarCompra() {
    if (localStorage.getItem("debbieComprado") === "true") {
        document.getElementById("status").textContent = "Já comprado!";
        document.getElementById("itemImg").style.pointerEvents = "none"; // Desativa clique
    }
}

// Atualiza o inventário
function atualizarInventario() {
    const inventario = JSON.parse(localStorage.getItem("inventario")) || [];
    document.getElementById("inventario").textContent = inventario.join(", ");
}

// Função de compra
function buyDebbie() {
    let valor = parseInt(localStorage.getItem("valor")) || 0;
    if (valor < 10) {
        alert("Você não tem zazas suficientes!");
        return;
    }

    // Atualiza o valor e salva
    valor -= 10;
    localStorage.setItem("valor", valor);
    document.getElementById("outraTelaContador").textContent = valor;

    // Marca o item como comprado
    localStorage.setItem("debbieComprado", "true");
    document.getElementById("status").textContent = "Já comprado!";
    document.getElementById("itemImg").style.pointerEvents = "none"; // Desativa clique

    // Adiciona ao inventário
    const inventario = JSON.parse(localStorage.getItem("inventario")) || [];
    inventario.push("Debbie");
    localStorage.setItem("inventario", JSON.stringify(inventario));
    atualizarInventario();
}
