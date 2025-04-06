import React, { useEffect } from 'react';
import '../styles/LeavesAnimation.css';

const LeavesBackground = () => {
  useEffect(() => {
    const container = document.getElementById('leaves');
    if (!container) return;

    container.innerHTML = ''; // clear old leaves if reloaded

    for (let i = 0; i < 25; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';

      const size = Math.random() * 20 + 15; // 15px to 35px
      const left = Math.random() * 100; // % across screen
      const delay = Math.random() * 10; // delay before falling
      const duration = 5 + Math.random() * 10; // fall speed
      const swayDuration = 2 + Math.random() * 3;

      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leaf.style.left = `${left}%`;
      leaf.style.animationDelay = `${delay}s`;
      leaf.style.animationDuration = `${duration}s`;
      leaf.style.setProperty('--sway-duration', `${swayDuration}s`);

      container.appendChild(leaf);
    }
  }, []);

  return <div id="leaves"></div>;
};

export default LeavesBackground;
