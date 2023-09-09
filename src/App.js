import { useEffect, useState } from "react";
import Box from "./Box";

function App() {
  const [winner, setWinner] = useState({ player: null, combination: null });
  const [turn, setTurn] = useState('X');
  const [boxState, setBoxState] = useState([null, null, null, null, null, null, null, null, null]);
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function updatedBoxState(boxNumber) {
    setBoxState(prevState => {
      const newState = [...prevState];
      newState[boxNumber] = turn;
      return newState;
    })
    setTurn(prevPlayer => prevPlayer === 'X' ? 'O' : 'X');
  }

  const getWinner = () => {
    let finalWinner = { player: null, combination: null };
    for (const combination of winningCombinations) {
      const [x, y, z] = combination;
      if (boxState[x] && boxState[x] === boxState[y] && boxState[x] === boxState[z]) {
        finalWinner.player = boxState[x];
        finalWinner.combination = combination;
      }
    }
    return finalWinner;
  }

  useEffect(() => {
    const win = getWinner();
    if (win.player) {
      setWinner(win);
    }
    else if (turn === "O") {
      fetch('https://hiring-react-assignment.vercel.app/api/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boxState),
      })
        .then(response => response.json())
        .then(boxNumber => {
          const updatedBoxState = [...boxState];
          if (boxNumber >= 0 && boxNumber < 9 && !updatedBoxState[boxNumber]) {
            updatedBoxState[boxNumber] = "O";
            setBoxState(updatedBoxState);
            setTurn("X");
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [turn, boxState]);


  return (
    <div className="App">
      <h1>
        {
          boxState.includes(null) ?
            winner.player !== null ? `Winner: ${winner.player}` : `Turn: Player ${turn}` :
            winner.player === null ? `Game Draw` : `Winner: ${winner.player}`
        }</h1>
      <div className={`game-box ${turn === 'O' ? 'disable' : ''}`}>
        {
          boxState.map((value, index) => {
            let isWinner = false;
            if (winner.combination && winner.combination.includes(index)) {
              isWinner = true;
            }
            return (
              <Box key={index} index={index} value={value} updatedBoxState={updatedBoxState} isWinner={isWinner} winner={winner} />
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
