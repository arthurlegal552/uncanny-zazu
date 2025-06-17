function getGameState() {
    return {
        valor: parseInt(localStorage.getItem("zazuClicker_valor")) || 0,
        hunger: parseInt(localStorage.getItem("zazuClicker_hunger")) || 100,
        thirst: parseInt(localStorage.getItem("zazuClicker_thirst")) || 100
    };
}

function updateGameState(newState) {
    localStorage.setItem("zazuClicker_valor", newState.valor.toString());
    localStorage.setItem("zazuClicker_hunger", newState.hunger.toString());
    localStorage.setItem("zazuClicker_thirst", newState.thirst.toString());
}