// Physics constants
const GRAVITY = 0.5;
const FRICTION = 0.98;
const BOUNCE = 0.7;
const COIN_SIZE = 30;

document.addEventListener("DOMContentLoaded", () => {
    const valorSalvo = parseInt(localStorage.getItem("valor")) || 0;
    document.getElementById("outraTelaContador").textContent = valorSalvo;
});

function dropCoin(container) {
    const coin = document.createElement('div');
    coin.className = 'money-coin';
    
    // Initial position at vendor's bottom center
    const startX = container.offsetWidth / 2 - COIN_SIZE/2;
    const startY = container.offsetHeight - COIN_SIZE;
    
    // Random initial velocity
    const velocity = {
        x: (Math.random() - 0.5) * 10,
        y: -5 - Math.random() * 5
    };
    
    let posX = startX;
    let posY = startY;
    let isActive = true;
    
    coin.style.left = `${posX}px`;
    coin.style.top = `${posY}px`;
    container.appendChild(coin);
    
    // Physics animation loop
    function animate() {
        if (!isActive) return;
        
        // Apply gravity
        velocity.y += GRAVITY;
        
        // Apply friction
        velocity.x *= FRICTION;
        velocity.y *= FRICTION;
        
        // Update position
        posX += velocity.x;
        posY += velocity.y;
        
        // Check floor collision
        if (posY + COIN_SIZE > container.offsetHeight) {
            posY = container.offsetHeight - COIN_SIZE;
            velocity.y *= -BOUNCE;
            velocity.x *= 0.8; // Friction on bounce
            
            // Stop coin if energy is low
            if (Math.abs(velocity.y) < 0.5 && Math.abs(velocity.x) < 0.5) {
                isActive = false;
                setTimeout(() => {
                    coin.remove();
                }, 1000);
                return;
            }
        }
        
        // Check wall collisions
        if (posX < 0 || posX + COIN_SIZE > container.offsetWidth) {
            velocity.x *= -BOUNCE;
            posX = posX < 0 ? 0 : container.offsetWidth - COIN_SIZE;
        }
        
        coin.style.left = `${posX}px`;
        coin.style.top = `${posY}px`;
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

function createMoneyEffect() {
    const vendor = document.querySelector('.vendedor');
    const coinsToDrop = 15;
    
    for (let i = 0; i < coinsToDrop; i++) {
        setTimeout(() => {
            dropCoin(vendor);
        }, i * 100);
    }
}

function buyDebbie() {
    let valor = parseInt(localStorage.getItem("valor")) || 0;
    const dialogo = document.querySelector(".texthat h1");
    const img = document.querySelector(".vendedor img");
    
    if (valor < 10) {
        dialogo.textContent = "you dont have enough zazas";
        return;
    }
    
    valor -= 10;
    dialogo.textContent = "thank you";
    
    img.classList.add("vendedorestica");
    createMoneyEffect();

    setTimeout(() => {
        img.classList.remove("vendedorestica");
    }, 400);
        
    localStorage.setItem("valor", valor);
    document.getElementById("outraTelaContador").textContent = valor;
}