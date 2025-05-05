function createMoneyEffect() {
    const vendedor = document.querySelector('.vendedor');
    
    // Create more money for a better leak effect
    for (let i = 0; i < 20; i++) {
      const money = document.createElement('div');
      money.className = 'money-effect';
      
      // Random leak direction - mostly downward with some variation
      const leakX = (Math.random() * 100 - 50); // -50 to 50
      const leakY = Math.random() * 30; // 0 to 30
      
      money.style.setProperty('--leak-x', `${leakX}px`);
      money.style.setProperty('--leak-y', `${leakY}px`);
      
      // Random delay for staggered leaking
      money.style.animationDelay = `${i * 0.05}s`;
      
      vendedor.appendChild(money);
      
      // Remove after animation
      setTimeout(() => {
        money.remove();
      }, 1500);
    }
  }