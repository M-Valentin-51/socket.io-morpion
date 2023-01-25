/**
 * 
 */

 class Game {

    constructor(player1 , player2 , server , room){
        this.player1 = player1;
        this.player2 = player2;
        this.server = server;
        this.room = room;
        this.plateau = [null ,null ,null ,null ,null ,null ,null ,null ,null]
        this.round = 0;
        this.winner = ""
    }

    start(){
        console.log("start");

        this.player1.join(this.room)
        this.player2.join(this.room)


        this.sendTurn();

    }

    finMatch(msg){
         this.server.to(this.room).emit("gameEnd" , 
            {
                turn : false,
                msg : `${msg} ${this.winner}`
            }
    )
    }

    sendTurn(){

        if(this.round % 2 === 0){
        this.server.to(this.room).emit("game" , 
            {
                [this.player1.id] : {turn :true},
                [this.player2.id] : {turn :false},
                plateau : this.plateau,
                room : this.room,
                game : true
            }
        )
        }else{
            this.server.to(this.room).emit("game" , 
                {
                    [this.player1.id] : {turn :false},
                    [this.player2.id] : {turn :true},
                    plateau : this.plateau,
                    room : this.room,
                    game : true
                }
            )
        }

        
    }

    setPlateau(newPlateau){
        this.plateau = newPlateau
    }

    verifPlateau(){

        /**
         *  0 , 1 , 2
         *  3 , 4 , 5
         *  6 , 7 , 8 
         */

     if(this.verifLine(this.plateau[0] , this.plateau[1] , this.plateau[2])){return "victoire"}
     else if(this.verifLine(this.plateau[3] , this.plateau[4] , this.plateau[5])){return "victoire"}
     else if(this.verifLine(this.plateau[6] , this.plateau[7] , this.plateau[8])){return "victoire"}
     else if(this.verifLine(this.plateau[0] , this.plateau[3] , this.plateau[6])){return "victoire"}
     else if(this.verifLine(this.plateau[1] , this.plateau[4] , this.plateau[7])){return "victoire"}
     else if(this.verifLine(this.plateau[2] , this.plateau[5] , this.plateau[8])){return "victoire"}
     else if(this.verifLine(this.plateau[0] , this.plateau[4] , this.plateau[8])){return "victoire"}
     else if(this.verifLine(this.plateau[2] , this.plateau[4] , this.plateau[6])){return "victoire"}
     else if(this.mathNull() < 0 ){return "match null"}

    }

    verifLine(l1 , l2 , l3){
        if(l1 === l2 && l1 === l3 && l1 != null){
            if(l1 === this.player1.id){
                this.winner = this.player1.handshake.query.name
            }else{
                this.winner = this.player2.handshake.query.name
            }
            return true
            
        }
    }

    mathNull(){
       return this.plateau.findIndex(elt => elt === null)
    }
}

module.exports = {Game}