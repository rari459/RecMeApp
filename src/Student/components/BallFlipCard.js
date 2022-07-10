import { useState } from "react";
import ReactCardFlip from 'react-card-flip';

const ballStyle = {
    ballfront : {
        height: 100,
        width: 100,
        backgroundColor: '#A50035',
        borderRadius: '50%',
        left: 80,
        position: 'relative',  
    },
    ballback : {
        height: 100,
        width: 100,
        backgroundColor: '#6c757d',
        borderRadius: '50%',
        left: 80,
        position: 'relative',
    }
}

export const BallFlipCard = () => {
    const [isFlipped, setFlipped] = useState(false);

    const handleMouseEnter = e => {
        setFlipped(!isFlipped)
        console.log("enter")
      }
      const handleMouseLeave = e => {
        setFlipped(false)
        console.log("leave")
      }

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div 
            style = {ballStyle.ballfront}
            onMouseEnter={()=>{handleMouseEnter()}}
            onMouseLeave={()=>{handleMouseLeave()}}>
            </div>
            <div 
            style = {ballStyle.ballback}
            onMouseEnter={()=>{handleMouseEnter()}}
            onMouseLeave={()=>{handleMouseLeave()}}>
            </div>
        </ReactCardFlip>

    )
}