export function ModaleAlert({msg , setGameEnd , setGame , setPlateau}){
    return(
        <div className="modale">
            <div className="msg">
                <p>{msg}</p>
                <button onClick={() => {
                    setGameEnd(false)
                    setGame(false)
                    setPlateau([])
                }}>ok</button>
            </div>
        </div>
    )
}

export function ModaleConfirm({setconfirmConnexion , player}){
    console.log(player)
    return(
        <div className="modale">
            <div className="msg">
                <p>{`${player.name} veut jouer avec toi !`}</p>
                <button onClick={() => {
                    setconfirmConnexion(false)
                }}>Refuser</button>
                <button onClick={() => {
                    setconfirmConnexion(true)
                }}>Accepter</button>
            </div>
        </div>
    )
}