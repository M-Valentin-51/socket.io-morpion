function caseIsvalid(plateau , i , setPlateau , setTurn , socket , room) {

    console.log(`room : ${room}`);
    if(plateau[i] == null){
        plateau[i] = socket.id
        setPlateau(plateau)

        //socket.emit("plateau" , plateau)

        socket.emit("game" , {plateau ,room})
        setTurn(false)
    }
}

function getValue(id , socketId){
    if(id){
        if(id == socketId){
            return "X"
        }else {
            return "O"
        }
    }
}


function Game({plateau , turn , setPlateau , setTurn , socket , room}){

        const change = (e) => {

        if(turn){
        caseIsvalid(plateau , e.target.id , setPlateau , setTurn , socket , room)
        }
    } 

    return(
        <div className="game">
        {turn ? <p className="turnOn"> C'est a vous de jouer</p>: <p className="turnOff"> Votre adversaire est en train de jouer ... </p>}
        <div className="plateau">
            {plateau.map((element , index) => (
                <div id={index} onClick={(e) => change(e)} >{getValue(element , socket.id)}</div>
            ))}
        </div>
        </div>
    )
}
export default Game