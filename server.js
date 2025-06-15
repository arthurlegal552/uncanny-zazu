const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const rooms = {};

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch(data.type) {
      case "createRoom":
        handleCreateRoom(ws);
        break;
        
      case "joinRoom":
        handleJoinRoom(ws, data.roomId);
        break;
        
      case "startBattle":
        handleStartBattle(data.roomId);
        break;
        
      case "playerClick":
        handlePlayerClick(data.roomId, data.count);
        break;
        
      case "battleResult":
        handleBattleResult(data.roomId, data.result);
        break;
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    // Clean up rooms if needed
  });
});

function handleCreateRoom(ws) {
  const roomId = generateRoomId();
  rooms[roomId] = {
    host: ws,
    opponent: null,
    inBattle: false
  };
  
  ws.send(JSON.stringify({
    type: "roomCreated",
    roomId: roomId
  }));
}

function handleJoinRoom(ws, roomId) {
  if (rooms[roomId] && !rooms[roomId].opponent) {
    rooms[roomId].opponent = ws;
    
    // Notify host
    rooms[roomId].host.send(JSON.stringify({
      type: "playerJoined"
    }));
    
    // Notify joining player
    ws.send(JSON.stringify({
      type: "roomJoined",
      roomId: roomId
    }));
  } else {
    ws.send(JSON.stringify({
      type: "error",
      message: "Room not found or already full"
    }));
  }
}

function handleStartBattle(roomId) {
  if (rooms[roomId] && rooms[roomId].host && rooms[roomId].opponent) {
    rooms[roomId].inBattle = true;
    
    // Notify both players
    rooms[roomId].host.send(JSON.stringify({
      type: "battleStarted"
    }));
    
    rooms[roomId].opponent.send(JSON.stringify({
      type: "battleStarted"
    }));
  }
}

function handlePlayerClick(roomId, count) {
  if (rooms[roomId] && rooms[roomId].inBattle) {
    const room = rooms[roomId];
    const targetWS = room.host === ws ? room.opponent : room.host;
    
    if (targetWS) {
      targetWS.send(JSON.stringify({
        type: "opponentClick",
        count: count
      }));
    }
  }
}

function handleBattleResult(roomId, result) {
  if (rooms[roomId]) {
    const room = rooms[roomId];
    const targetWS = room.host === ws ? room.opponent : room.host;
    
    if (targetWS) {
      targetWS.send(JSON.stringify({
        type: "battleResult",
        result: result
      }));
    }
    
    // Clean up room after battle
    delete rooms[roomId];
  }
}

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

console.log('WebSocket server running on ws://localhost:8080');