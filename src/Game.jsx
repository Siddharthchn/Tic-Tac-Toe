import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import img from './assets/v.jpg';

const initialState = Array(9).fill(null);

const Game = () => {
  const [board, setBoard] = useState(initialState);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    checkWinner();
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(makeComputerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isPlayerTurn, winner]);

  useEffect(() => {
    if (winner) {
      if (winner === 'Tie') {
        toast.info('It\'s a Tie!', { position: "top-center" });
      } else if (winner === 'X') {
        toast.success('You have won!', { position: "top-center" });
      } else if (winner === 'O') {
        toast.error('Computer has won!', { position: "top-center" });
      }
    }
  }, [winner]);

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    // Animate the cell with GSAP
    gsap.fromTo(
      `#cell-${index}`,
      { scale: 0 },
      { scale: 1, duration: 0.5 }
    );
  };

  const makeComputerMove = () => {
    const newBoard = [...board];
    const winningMove = findBestMove(newBoard, 'O');
    const blockingMove = findBestMove(newBoard, 'X');
    const move = winningMove !== null ? winningMove : blockingMove !== null ? blockingMove : getRandomMove(newBoard);

    if (move !== null) {
      newBoard[move] = 'O';
      setBoard(newBoard);
      setIsPlayerTurn(true);

      // Animate the cell with GSAP
      gsap.fromTo(
        `#cell-${move}`,
        { scale: 0 },
        { scale: 1, duration: 0.5 }
      );
    }
  };

  const findBestMove = (board, player) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] === player && board[b] === player && board[c] === null) return c;
      if (board[a] === player && board[c] === player && board[b] === null) return b;
      if (board[b] === player && board[c] === player && board[a] === null) return a;
    }

    return null;
  };

  const getRandomMove = (board) => {
    const emptyCells = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((cell) => cell !== null);

    if (emptyCells.length === 0) return null;

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const checkWinner = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }

    if (board.every((cell) => cell !== null)) {
      setWinner('Tie');
    }
  };

  const resetGame = () => {
    setBoard(initialState);
    setIsPlayerTurn(true);
    setWinner(null);
    toast.dismiss(); // Dismiss any existing toast notifications
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-4xl font-bold text-white mb-8">Tic-Tac-Toe</h1>
      <div className="relative w-80 h-80 mb-4">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 border-2">
          {board.map((cell, index) => (
            <div
              key={index}
              id={`cell-${index}`}
              className="border flex items-center justify-center text-3xl font-bold cursor-pointer"
              onClick={() => handleClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={resetGame}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Reset Game / Play Again
      </button>
      <ToastContainer />
    </div>
  );
};

export default Game;
