import { useState } from 'react';
import { useCookies } from 'react-cookie';
import './App.css';

export default function Game() {
  const [cookies, setCookie] = useCookies(['score']);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [score, setScore] = useState(cookies.score || { X: 0, O: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      nextSquares[i] = xIsNext ? 'X' : 'O';
      onPlay(nextSquares);
    }

    return (
      <div className="board">
        {[...Array(3)].map((_, i) => (
          <div className="board-row" key={i}>
            {squares.slice(i * 3, i * 3 + 3).map((square, j) => (
              <button className="square" key={j} onClick={() => handleClick(i * 3 + j)}>
                {square}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  }
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winner = calculateWinner(nextSquares);
    if (winner) {
      setScore(prevScore => {
        const newScore = { ...prevScore, [winner]: prevScore[winner] + 1 };
        setCookie('score', newScore, { path: '/' });
        return newScore;
      });
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }



  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <table>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
          <tr>
            <td>X</td>
            <td>O</td>
          </tr>
          <tr>
            <td>{score.X}</td>
            <td>{score.O}</td>
          </tr>
        </table>
      </div>
      <div className="game-info">
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}