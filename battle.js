// Battle System Variables
let inBattle = false;
let battleClicks = 0;
let opponentClicks = 0;
let battleTimer = 30;
let battleInterval;
let socket;
let roomId = null;
let isHost = false;
let opponentConnected = false;

// Initialize WebSocket connection
function initWebSocket() {
    // For development, you can use a local server or mock connection
    try {
        // In a real deployment, replace with your actual WebSocket server URL
        const wsUrl = 'ws://localhost:8080' || 'wss://your-websocket-server.com';
        socket = new WebSocket(wsUrl);
        
        socket.onopen = function(e) {
            console.log("Connected to battle server");
            // Create or join a room
            if (roomId) {
                socket.send(JSON.stringify({type: "join", room: roomId}));
            } else {
                isHost = true;
                roomId = generateRoomId();
                socket.send(JSON.stringify({type: "create", room: roomId}));
                updateBattleButton("Waiting for opponent...", true);
            }
        };
        
        socket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                handleSocketMessage(data);
            } catch (e) {
                console.error("Error parsing message:", e);
            }
        };
        
        socket.onclose = function(event) {
            console.log('Connection closed');
            if (inBattle) {
                endBattle("Opponent disconnected - you win by default!");
            }
            updateBattleButton("Connection lost. Click to retry", false);
        };
        
        socket.onerror = function(error) {
            console.log('WebSocket error:', error);
            updateBattleButton("Connection error. Click to retry", false);
        };
    } catch (e) {
        console.error("WebSocket initialization failed:", e);
        // Fallback to local multiplayer
        alert("Couldn't connect to server. Using local multiplayer instead.");
        setupLocalMultiplayer();
    }
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8);
}

function handleSocketMessage(data) {
    switch(data.type) {
        case "connected":
            opponentConnected = true;
            updateBattleButton("Start Battle!", false);
            break;
        case "click":
            opponentClicks = data.count;
            document.getElementById("opponentClicks").textContent = opponentClicks;
            break;
        case "result":
            showBattleResult(data.winner);
            break;
        case "error":
            console.error("Server error:", data.message);
            break;
    }
}

function updateBattleButton(text, disabled) {
    const btn = document.getElementById("battleButton");
    btn.textContent = text;
    btn.disabled = disabled;
}

// Battle Functions
function startBattle() {
    if (!opponentConnected && !localMultiplayer) {
        alert("Waiting for an opponent to connect...");
        return;
    }
    
    inBattle = true;
    battleClicks = 0;
    opponentClicks = 0;
    battleTimer = 30;
    
    document.getElementById("battleArea").style.display = "block";
    document.getElementById("battleButton").style.display = "none";
    document.getElementById("playerClicks").textContent = "0";
    document.getElementById("opponentClicks").textContent = "0";
    document.getElementById("battleResult").textContent = "";
    document.getElementById("battleTimer").textContent = battleTimer;
    
    // Start battle timer
    battleInterval = setInterval(updateBattleTimer, 1000);
    
    // Modify click handler for battle mode
    window.battleClickHandler = function() {
        battleClicks++;
        document.getElementById("playerClicks").textContent = battleClicks;
        
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "click",
                count: battleClicks,
                room: roomId
            }));
        }
    };
}

function updateBattleTimer() {
    battleTimer--;
    document.getElementById("battleTimer").textContent = battleTimer;
    
    if (battleTimer <= 0) {
        endBattle();
    }
}

function endBattle(reason) {
    clearInterval(battleInterval);
    inBattle = false;
    
    let result = reason || "";
    if (!reason) {
        if (battleClicks > opponentClicks) {
            result = "You win!";
            // Reward for winning
            addScore(1000);
        } else if (battleClicks < opponentClicks) {
            result = "You lose!";
        } else {
            result = "It's a tie!";
        }
    }
    
    showBattleResult(result);
    
    // Send result to opponent if you're the host
    if (isHost && socket && socket.readyState === WebSocket.OPEN && !reason) {
        socket.send(JSON.stringify({
            type: "result",
            winner: result,
            room: roomId
        }));
    }
}

function showBattleResult(result) {
    document.getElementById("battleResult").textContent = result;
    document.getElementById("battleButton").style.display = "block";
    document.getElementById("battleButton").textContent = "Battle Again!";
    
    // Reset after 5 seconds
    setTimeout(() => {
        document.getElementById("battleArea").style.display = "none";
    }, 5000);
}

function addScore(points) {
    valor += points;
    document.getElementById("contadas").textContent = valor;
    saveGameState();
}

// Local Multiplayer Fallback
let localMultiplayer = false;
let currentPlayer = 1;
let player1Clicks = 0;
let player2Clicks = 0;

function setupLocalMultiplayer() {
    localMultiplayer = true;
    updateBattleButton("Start Local 2-Player Battle", false);
    
    document.getElementById("opponentClicks").previousSibling.textContent = "Player 2 Clicks: ";
}

function startLocalBattle() {
    inBattle = true;
    player1Clicks = 0;
    player2Clicks = 0;
    currentPlayer = 1;
    battleTimer = 30;
    
    document.getElementById("battleArea").style.display = "block";
    document.getElementById("battleButton").style.display = "none";
    document.getElementById("playerClicks").textContent = "0";
    document.getElementById("opponentClicks").textContent = "0";
    document.getElementById("battleResult").textContent = "";
    document.getElementById("battleTimer").textContent = battleTimer;
    
    battleInterval = setInterval(updateBattleTimer, 1000);
    
    window.battleClickHandler = function() {
        if (currentPlayer === 1) {
            player1Clicks++;
            document.getElementById("playerClicks").textContent = player1Clicks;
            currentPlayer = 2;
        } else {
            player2Clicks++;
            document.getElementById("opponentClicks").textContent = player2Clicks;
            currentPlayer = 1;
        }
    };
}

// Event Listeners
document.getElementById("battleButton").addEventListener("click", function() {
    if (!inBattle) {
        if (localMultiplayer) {
            startLocalBattle();
        } else {
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                initWebSocket();
            } else {
                startBattle();
            }
        }
    }
});

// Modify your existing aumentarValor function in game.js to include:
// if (inBattle) { battleClickHandler(); return; }