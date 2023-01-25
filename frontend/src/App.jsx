import { useState } from 'react'
import './App.css'

import { io } from "socket.io-client";
import { useRef } from 'react';
import Game from './Game';
import {ModaleAlert, ModaleConfirm} from './Modale';
import { useEffect } from 'react';


//let p = [null ,null ,null ,null ,null ,null ,null ,null ,null]

function App() {
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [idList , setIdList] = useState([])
  const nameRef = useRef()
  const [socket , setSocket] = useState()
  const [game , setGame] = useState(false)
  const [turn , setTurn ] = useState(false)
  const [plateau , setPlateau] = useState([])
  const [room , setRoom] = useState("");
  const [gameEnd , setGameEnd] = useState(false)
  const [confirmConnexion , setconfirmConnexion] = useState(null)

  function connectToPlayer (player) { 
    if(player.game == false || player.game == "false"){
      socket.emit("connectToPlayer" , {player2 : player.id})
    }
  }

  const incomingOpponent = idList.find(player => player.id === incomingRequest?.player1);

useEffect(() => {
  if (incomingOpponent) {
    // Envoie si le joueur 2 accepte la demande 

    if(confirmConnexion){
      socket.emit("setConnectionRequest" , {...incomingRequest , confirm : true})
      setIncomingRequest(null);
      setconfirmConnexion(null)
    }
    if(confirmConnexion == false){
      socket.emit("setConnectionRequest" , {...incomingRequest , confirm : false})
      setIncomingRequest(null);
      setconfirmConnexion(null)

    }
  }
} , [confirmConnexion])


  return (
    <>
    {!socket && <div className='App'>
      
        <section className='connexion'>
        <form onSubmit={(e) => {
          e.preventDefault()

          const name = nameRef.current.value;

          if (name.trim().length ) {
            let socket = io('http://localhost:5000', {
              withCredentials: true,
              extraHeaders: {
                "my-custom-header": "abcd"
              },
              query : {
                name : name,
                game : false
              }
            })

            if(socket){
              socket.on('newPlayer' , (data) => {
                console.log(data)
                setIdList(data)
              })

              socket.on("getConnectionRequest" , (data) => {
                setIncomingRequest(data);
              })

              socket.on("game" , (reponse) => {
                setGame(reponse.game);
                setTurn(reponse[socket.id].turn)
                setRoom(reponse.room)
                setPlateau(reponse.plateau)

                
                //console.log(reponse[socket.id]);
                console.log(reponse);
              })


              socket.on('gameEnd' ,  (rep) => {
                setGameEnd(rep.msg)
                setTurn(rep.turn)
                //alert(rep.msg)
                //setGame(rep.game)
                //setPlateau([])
              })

            }

            setSocket(socket)
          }
        }}>
          <label>Votre pseudo </label>
          <input ref={nameRef} type="text" />
          <button type="submit">Envoyer</button>
        </form>
        </section>
      
      </div>}
      <div className='appConnected'>
      { socket && <div className='listPlayer'>
        <p>Liste des joueurs</p>
        <ul>
          {
            idList.filter((player) => player.id != socket.id).map((player) => (
              <li className={player.game ? 'indisponible' : 'disponilble'} key={player.id} onClick={() => {
                if(game == false) {
                  connectToPlayer(player)
                }
              //alert(player.id)
              }}>
                {player.name}
              </li>
            ))
          }
        </ul>
      </div>}

     {game && <Game plateau={plateau} setPlateau={setPlateau} turn={turn} setTurn={setTurn} socket={socket} room={room}  />}
    </div>

    {gameEnd && <ModaleAlert setGameEnd={setGameEnd} msg={gameEnd} setGame={setGame} setPlateau={setPlateau}/>}

    {incomingRequest && !gameEnd && <ModaleConfirm setconfirmConnexion={setconfirmConnexion} player={incomingOpponent}/>}
    </>
  )
}

export default App
