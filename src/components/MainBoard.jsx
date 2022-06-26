import React from 'react'
import O_gif from '../images/O.gif'
import X_gif from '../images/X.gif'
import A_gif from '../images/A.gif'
import I_gif from '../images/I.gif'
import { useState } from 'react'
import useSound from 'use-sound';
import levelBip from '../sounds/level_sound.wav';
import selectBip from '../sounds/select_sound.wav';
import { Link } from 'react-router-dom'
import MainSong from '../sounds/MainSong.mp3'
import ReactAudioPlayer from 'react-audio-player'

function MainBoard() {

    const [level,set_level]=useState(1)
    const [playLevelSound]=useSound(levelBip,{volume:0.2})
    const [playSelectSound]=useSound(selectBip,{volume:0.2})

    const handleLevel=(l)=>{
        playLevelSound()
        set_level(l)
    }
    const TextBackgroundOver=(e)=>{
        e.target.style.backgroundColor='green'
    }
    
    const TextBackgroundOut=(e)=>{
        e.target.style.backgroundColor='rgba(0,0,0,0.5)'
        playSelectSound()
    }

  return (
  
               <div style={{display:'list-item'}}>
                <ReactAudioPlayer src={MainSong} autoPlay={true} loop={true} volume={0.2}/>
                   <div>
                   <h1 style={{color:'white',fontSize:'50px',marginBottom:'60px'}}>T<img height={40} width={40} src={I_gif} />K T<img height={40} width={40} src={A_gif} />K T<img height={40} width={40} src={O_gif} />E</h1>
                   </div>
                   <div className='game_lavel_container'>
                    <h3 className='levels_title'>Choose Game Level :</h3>
                    <div className='levels'>
                        <div className='game_level' onClick={()=>handleLevel(1)} style={{backgroundColor:(level==1 )&& 'green'}}><h3 className='level'>1</h3></div>
                        <div className='game_level' onClick={()=>handleLevel(2)}  style={{backgroundColor:(level==2 )&& 'green'}} ><h3 className='level'>2</h3></div>
                    </div>
                   </div>
                   <Link style={{textDecoration: 'none'}} to={`/LocalMultiplayer/L${level}`}><h1 onMouseOver={TextBackgroundOver} onMouseOut={TextBackgroundOut} style={{color:'white',cursor:'pointer'}}>Play now</h1></Link>
                   <Link  style={{textDecoration: 'none'}} to={`/VsIAPlayer/L${level}`} ><h1 onMouseOver={TextBackgroundOver} onMouseOut={TextBackgroundOut} style={{color:'white',cursor:'pointer'}} style={{color:'white'}}>VS IA Player</h1></Link>
                   <h1 onMouseOver={TextBackgroundOver} onMouseOut={TextBackgroundOut} style={{color:'white',cursor:'pointer'}} style={{color:'white'}}>Play online</h1>
                   <h1 onClick={()=>window.close()} onMouseOver={TextBackgroundOver} onMouseOut={TextBackgroundOut} style={{color:'white',cursor:'pointer'}} style={{color:'white'}}>Exit</h1>

               </div>


  )
}

export default MainBoard



