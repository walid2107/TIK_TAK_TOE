import React, { useState, useEffect } from "react";
import { calculateAITurn } from "./IA";
import "../css/VsIAPlayer.css";
import { Table, Tbody, Tr,Td } from "react-super-responsive-table";
import bipSfx from '../sounds/Tik_Tak_Sound.mp3';
import GameOverSound from '../sounds/game_over.wav'
import gameStartedSound from '../sounds/gameStarted.wav'
import ReactAudioPlayer from 'react-audio-player';
import PlayGroundSound from '../sounds/PlayGroundMusic.mp3'
import useSound from 'use-sound';

const GAME_STATE = {
  PLAYER_TURN: "player_turn",
  AI_TURN: "ai_turn",
  PLAYER_WON: "player_won",
  AI_WON: "player_o_won",
  DRAW: "game_draw",
  ERROR: "game_error"
};

export const SPACE_STATE = {
  PLAYER: "player_filled",
  AI: "ai_filled",
  EMPTY: "empty_space"
};

export const GRID_LENGTH = 9;
const MAX_MOVES = 10;

const getGameStatus = (gameState) => {
  switch (gameState) {
    case GAME_STATE.PLAYER_TURN: {
      return "Your Turn";
    }
    case GAME_STATE.AI_TURN: {
      return "AI Turn";
    }
    case GAME_STATE.PLAYER_WON: {
      return "You Won!";
    }
    case GAME_STATE.AI_WON: {
      return "AI is the winner !";
    }
    case GAME_STATE.DRAW: {
      return "Draw";
    }
    case GAME_STATE.ERROR: {
      return "Error";
    }
    default: {
      return "Unknown game state " + gameState;
    }
  }
};

const getSquareSymbol = (spaceStatus) => {
  switch (spaceStatus) {
    case SPACE_STATE.PLAYER: {
      return "X";
    }
    case SPACE_STATE.AI: {
      return "O";
    }
    case SPACE_STATE.EMPTY: {
      return "";
    }
    default: {
      return "";
    }
  }
};

const createEmptyGrid = () => {
  return Array(GRID_LENGTH).fill(SPACE_STATE.EMPTY);
};

const getSpaceStateClass = (spaceState, gameState, winSpaces, spaceIndex) => {
  let space = "";

  if (spaceState === SPACE_STATE.AI) {
    space += "o-player";

    if (gameState === GAME_STATE.AI_WON && winSpaces.includes(spaceIndex)) {
      space += " o-winner";
    }
  }

  if (spaceState === SPACE_STATE.PLAYER) {
    space += "x-player";

    if (gameState === GAME_STATE.PLAYER_WON && winSpaces.includes(spaceIndex)) {
      space += " x-winner";
    }
  }

  return space;
};

const isDraw = (moveCount) => {
  return moveCount === MAX_MOVES;
};

const checkWinner = (grid, moveCount) => {
  const winnerSpaces = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  if (isDraw(moveCount)) {
    return {
      winner: GAME_STATE.DRAW,
      winSpaces: []
    };
  }

  for (let i = 0; i < winnerSpaces.length; i++) {
    const [a, b, c] = winnerSpaces[i];

    if (
      grid[a] === SPACE_STATE.EMPTY &&
      grid[b] === SPACE_STATE.EMPTY &&
      grid[c] === SPACE_STATE.EMPTY
    ) {
      continue;
    }

    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      let winner = null;

      if (grid[a] === SPACE_STATE.PLAYER) {
        winner = GAME_STATE.PLAYER_WON;
      } else {
        winner = GAME_STATE.AI_WON;
      }

      return {
        winner: winner,
        winSpaces: [a, b, c]
      };
    }
  }

  return null;
};

export default function VsIAPlayerL1() {
  // Grid State
  const [grid, setGrid] = useState(createEmptyGrid());
  // Count of all moves made
  const [moveCount, setMoveCount] = useState(0);
  // Spaces used to get a win
  const [winSpaces, setWinSpaces] = useState([]);
  // Current game state
  const [gameState, setGameState] = useState(GAME_STATE.PLAYER_TURN);

  const [winner,setWinner]=useState()
  const [play] = useSound(bipSfx);
  const [StartGame]=useSound(gameStartedSound)
  const [playGameOver]=useSound(GameOverSound,{volume:0.2})
  // Whenever the game state changes
  // from player interaction,
  // we handle logic flow in
  // here.
  useEffect(() => {
    // Player took turn,
    // check if game still running.
    let winner = checkWinner(grid, moveCount);

    // If the player won, update state to reflect.
    if (winner) {
      setGameState(winner.winner);
      setWinSpaces(winner.winSpaces);
    }

    // Run AI turn
    if (gameState === GAME_STATE.AI_TURN && moveCount < 10) {
      const aiSpace = calculateAITurn(grid, moveCount);
      setMoveCount((oldMoves) => {
        return oldMoves + 1;
      });
      fillGridSpace(aiSpace, SPACE_STATE.AI);
      winner = checkWinner(grid, moveCount);
    }

    // If AI won, update state to reflect, else
    // go back to player turn.
    if (winner) {
      setGameState(winner.winner);
      setWinSpaces(winner.winSpaces);
    } else {
      setGameState(GAME_STATE.PLAYER_TURN);
    }
  }, [gameState, grid]);

  // Reset state to default values
  const reset = () => {
    setGrid(createEmptyGrid());
    setGameState(GAME_STATE.PLAYER_TURN);
    setMoveCount(0);
    setWinSpaces([]);
  };

  // Fill in a grid box with status
  const fillGridSpace = (gridIndex, spaceStatus) => {
    setGrid((oldGrid) => {
      oldGrid[gridIndex] = spaceStatus;
      return [...oldGrid];
    });
  };

  // Fill in the grid array with the player space state.
  const handlePlayerClick = (gridIndex) => {
    if (gameState !== GAME_STATE.PLAYER_TURN) {
      return;
    }

    if (grid[gridIndex] === SPACE_STATE.EMPTY) {
      fillGridSpace(gridIndex, SPACE_STATE.PLAYER);
      setGameState(GAME_STATE.AI_TURN);
      setMoveCount((oldMoves) => {
        return oldMoves + 1;
      });
    }
  };

  const Cell=(props)=>{
    return <Td  className={
      getSpaceStateClass(
        grid[props.squareIndex],
        gameState,
        winSpaces,
        props.squareIndex
      )
    }   onClick={() => { handlePlayerClick(props.squareIndex);play() }}><div   style={{color:'rgb(87, 87, 212)', fontWeight:'bold',fontSize:'30px'}}>{getSquareSymbol(grid[props.squareIndex])}</div></Td>
};


  return (
    <>
      <ReactAudioPlayer src={PlayGroundSound} autoPlay={true} loop={true} volume={0.2}/>
         <div  className='line'>
           <h3>Just Play, Have Fun And</h3>
            <h2>Enjoy The Game</h2>
        </div>
          <Table>
            <Tbody >
                <Tr>
                    <Cell squareIndex={0}/>
                    <Cell squareIndex={1}/>
                    <Cell squareIndex={2}/>
                </Tr>
                <Tr>
                    <Cell squareIndex={3}/>
                    <Cell squareIndex={4}/>
                    <Cell squareIndex={5}/>
                </Tr>
                <Tr>
                    <Cell squareIndex={6}/>
                    <Cell squareIndex={7}/>
                    <Cell squareIndex={8}/>
                </Tr>
            </Tbody>
        </Table>

   

        {
        
        (gameState=='player_o_won' || gameState=='player_won') && <><h3 className='winner'>{getGameStatus(gameState)}</h3><button className='btn' onClick={()=>{reset()}}>Start Again</button></>
 
        }
         
      </>
    
   
  );
}
