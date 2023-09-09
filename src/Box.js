import React from 'react'

const Box = (props) => {
    return (
        <button className={props.isWinner ? 'final' : ''} onClick={() => props.updatedBoxState(props.index)} disabled={props.value !== null || props.winner.player !== null}>
            <p>{props.value}</p>
        </button>
    )
}

export default Box;