const express = require("express");
const app = express();
const port = 5000;

const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const {Game} = require("./Game");
const uuid = require('uuid');


const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

let listGame = []
io.on("connection", (socket) => {


    sendAllSocket()

    // un joueur envoie une demande a un autre joueur

    socket.on("connectToPlayer", (player) => {

        //console.log(player);
        // joueur 1 envoie la demande a l'autre joueur
        io.to(player.player2).emit("getConnectionRequest", {player1 : socket.id , ...player})

    })


    socket.on("setConnectionRequest" ,async (reponse) => {
        //console.log(reponse);
        // reponse :: { player1: 'HXYRCyq0CYplbkXaAAAF',player2: '1_hWBgrK76FgVc2XAAAD', confirm: true }
        
        if(reponse.confirm){

           /*
            * Creer un salon
            * Ajouter les 2 joueur au salon 
            * Lance une partie
            */

            let roomId = uuid.v4()

            let soc1 = await getSocketById(reponse.player1) 

             roomId = new Game(soc1 , socket , io , roomId)
             soc1.handshake.query.game = true
             socket.handshake.query.game = true

            sendAllSocket()
             roomId.start()
             listGame.push(roomId)

        }
    })

    socket.on("game" , (data) => {
        let game = listGame.find(game => game.room == data.room)
        let gameIndex = listGame.findIndex(game => game.room == data.room)

       game.setPlateau(data.plateau)


       game.round += 1
       game.sendTurn()

        const verif = game.verifPlateau()

        if(verif == "match null")
        {
            console.log("match null");
            game.finMatch("Match null")
            restartSocket(game.player1.id , game.player2.id)
            listGame.splice(gameIndex , 1)


        }else if(verif == "victoire"){
            console.log("victoire");
            game.finMatch(`Victoire de :`)
            restartSocket(game.player1.id , game.player2.id)
            listGame.splice(gameIndex , 1)

        }
    })
    
    socket.on("disconnect", async () => {
        console.log("Client as disconnected");
        let game = findGameByPlayerId(socket.id)
        let gameIndex = listGame.findIndex(game => game.player1.id == socket.id || game.player2.id == socket.id)


        if(game){
            game.finMatch("Votre adversaire est partie")
            
            if(game.player1.id == socket.id){
               await getSocketById(game.player2.id).then((soc) => soc.handshake.query.game = false)
            }else{
                await getSocketById(game.player1.id).then((soc) => soc.handshake.query.game = false)

            }

            listGame.splice(gameIndex , 1)
        }
        sendAllSocket();
    });
});


const sendAllSocket = async () => {
    const sockets = await io.fetchSockets();

    let ids = []
    for (const socket of sockets) {

        //console.log(socket);
        if (socket.handshake.query.name) {
            ids.push({id: socket.id, name: socket.handshake.query.name , game : JSON.parse(socket.handshake.query.game) })
        }
    }

    // Envoie la liste de tous les joueurs

    io.local.emit("newPlayer", ids)
}


const getSocketById =async (socketId) => {
    const sockets = await io.fetchSockets();

    const socket = sockets.find(soc => soc.id === socketId)

    return socket;

}


const restartSocket =async  (socketId1 , socketId2) => {

    let soc1 =await getSocketById(socketId1)
    soc1.handshake.query.game = false

    let soc2 = await getSocketById(socketId2)
    soc2.handshake.query.game = false
    sendAllSocket()
}



const findGameByPlayerId = (id) => {
    return listGame.find(game => game.player1.id == id || game.player2.id == id)
}


server.listen(port, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server listing on port ${port}`);
    }
});


