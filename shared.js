// Shared game state functions
function getGameState() {
    const saved = localStorage.getItem('zazuGameState');
    return saved ? JSON.parse(saved) : {
        valor: 0,
        hunger: 100,
        thirst: 100,
        isAlive: true
    };
}

function updateGameState(newState) {
    const current = getGameState();
    const updated = {...current, ...newState};
    localStorage.setItem('zazuGameState', JSON.stringify(updated));
    return updated;
}

function resetGameState() {
    localStorage.removeItem('zazuGameState');
}