let valor = Number(localStorage.getItem("zaza")) || 0;
document.getElementById("contadas").textContent = valor;

document.getElementById("zazu").addEventListener("click", () => {
  valor++;
  localStorage.setItem("zaza", valor);
  document.getElementById("contadas").textContent = valor;
});
