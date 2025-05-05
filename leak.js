function createMoneyEffect() {
    const vendor = document.querySelector('.vendedor');
    const vendorRect = vendor.getBoundingClientRect();
    const vendorBottom = vendorRect.bottom;
    const vendorCenterX = vendorRect.left + vendorRect.width/2;
  
    // Create more money for better effect
    for (let i = 0; i < 15; i++) {
      const money = document.createElement('div');
      money.className = 'money-effect';
      
      // Calculate random physics parameters
      const angle = Math.random() * Math.PI * 2; // Random direction
      const velocity = 2 + Math.random() * 3; // Random speed
      const gravity = 0.1 + Math.random() * 0.2; // Random gravity effect
      
      // Calculate positions at different animation percentages
      const x1 = Math.cos(angle) * velocity * 20;
      const y1 = Math.sin(angle) * velocity * 10;
      const x2 = Math.cos(angle) * velocity * 40;
      const y2 = y1 + gravity * 100;
      const x3 = Math.cos(angle) * velocity * 60;
      const y3 = y2 + gravity * 200;
      const x4 = Math.cos(angle) * velocity * 80;
      const y4 = y3 + gravity * 300;
      
      // Apply the calculated positions
      money.style.setProperty('--fall-x1', `${x1}px`);
      money.style.setProperty('--fall-y1', `${y1}px`);
      money.style.setProperty('--fall-x2', `${x2}px`);
      money.style.setProperty('--fall-y2', `${y2}px`);
      money.style.setProperty('--fall-x3', `${x3}px`);
      money.style.setProperty('--fall-y3', `${y3}px`);
      money.style.setProperty('--fall-x4', `${x4}px`);
      money.style.setProperty('--fall-y4', `${y4}px`);
      
      // Random delay for staggered falling
      money.style.animationDelay = `${i * 0.1}s`;
      
      vendor.appendChild(money);
      
      // Remove after animation
      setTimeout(() => {
        money.remove();
      }, 1000);
    }
  }