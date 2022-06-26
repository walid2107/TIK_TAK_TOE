import React from 'react'
import {useState} from "react"
import "../css/SinglePlayerArea.css"
import { Table, Tbody, Tr, Td } from 'react-super-responsive-table'
import useSound from 'use-sound';
import bipSfx from '../sounds/Tik_Tak_Sound.mp3';
import GameOverSound from '../sounds/game_over.wav'
import gameStartedSound from '../sounds/gameStarted.wav'
import ReactAudioPlayer from 'react-audio-player';
import PlayGroundSound from '../sounds/PlayGroundMusic.mp3'
const SinglePlayerArea = () => {
    const [turn,setTurn]=useState('X')
    const [cells,setCells]=useState(Array(9).fill(''))
    const [winner,setWinner]=useState()
    const [play] = useSound(bipSfx);
    const [StartGame]=useSound(gameStartedSound)
    const [playGameOver]=useSound(GameOverSound,{volume:0.2})
    const [endGame,setEndGame]=useState(false)

    
      
    const CheckWinner=(squares)=>{
        let combos={
            across:[
                [0,1,2],
                [3,4,5],
                [6,7,8],
            ],
            down:[
                [0,3,6],
                [1,4,7],
                [2,5,8],
            ],
            diagnol:[
                [0,4,8],
                [2,4,6]
            ]
        }
        let gameover=true;
        for(let combo in combos){
            combos[combo].forEach((pattern)=>{
                if(
                    squares[pattern[0]]==="" ||
                    squares[pattern[1]]==="" ||
                    squares[pattern[2]]==="" 
                ){
                  
                }
                else if(squares[pattern[0]]===squares[pattern[1]] && 
                    squares[pattern[1]]===squares[pattern[2]])
                {
                    setWinner(squares[pattern[0]]) 
                    gameover=false
                }
            })
            //check if all squares Are not empty and no winner 

            for(let i=0;i<9;i++){
                
                if(squares[i]==""){
                    gameover=false
                }
            }
            if(winner)
             {
                gameover=false
                setEndGame(false)
             }
            if(gameover==true)
            {
                setEndGame(true)
            }
        }
    }


    const handleClick=(num)=>{
        if(cells[num]!==""){
            return
        }
        let squares=[...cells]
        if(turn==="X"){
            squares[num]="X"
            setTurn("O")
        }
        else{
            squares[num]="O"
            setTurn("X")
        }
        CheckWinner(squares)
        setCells(squares)
    };



    const Cell=({num})=>{
        return <Td onClick={()=>{handleClick(num);play()}}><div style={{color:'rgb(87, 87, 212)', fontWeight:'bold',fontSize:'30px'}}>{cells[num]}</div></Td>
    };

    const handleRestart=()=>{
        setWinner(null)
        setEndGame(false)
        setCells(Array(9).fill(''))
    }



  return (
    <div className='container'>
        <ReactAudioPlayer src={PlayGroundSound} autoPlay={true} loop={true} volume={0.2}/>
        <div  className='line'>
           <h3>Just Play, Have Fun And</h3>
            <h2>Enjoy The Game</h2>
        </div>
        
        <Table>
            <Tbody >
                <Tr>
                    <Cell num={0}/>
                    <Cell num={1}/>
                    <Cell num={2}/>
                </Tr>
                <Tr>
                    <Cell num={3}/>
                    <Cell num={4}/>
                    <Cell num={5}/>
                </Tr>
                <Tr>
                    <Cell num={6}/>
                    <Cell num={7}/>
                    <Cell num={8}/>
                </Tr>
            </Tbody>
        </Table>
        {winner && playGameOver()}
        {winner && (
            <>
                <h3 className='winner'>{winner} is the winner!</h3>
                <button className='btn' onClick={()=>{handleRestart();StartGame()}}>Start Again</button>
            </>
        )}
        {
            (endGame && !winner) && playGameOver()
        }
        {     
            (endGame && !winner) &&  (
                <>
                    <h3 className='winner'>There is no winneer !</h3>
                    <button className='btn' onClick={()=>{handleRestart();StartGame()}}>Start Again</button>
                </>
            )
        }
    </div>
  )
}

export default SinglePlayerArea



