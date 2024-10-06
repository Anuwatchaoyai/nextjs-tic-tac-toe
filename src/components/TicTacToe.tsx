import { useUser } from "@auth0/nextjs-auth0/client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Switch } from "./ui/switch";

type BoardType = Array<string | null>;
const checkWinner = (currentBoard: BoardType): string | null => {
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

for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (
      currentBoard[a] &&
      currentBoard[a] === currentBoard[b] &&
      currentBoard[a] === currentBoard[c]
    ) {
      return currentBoard[a];
    }
  }
  return null;
};

const minimax = (
	currentBoard: BoardType,
	depth: number,
	isMaximizing: boolean
) => {
  const winner = checkWinner(currentBoard);
  if (winner === "O") return 10 - depth; // Bot Win
  if (winner === "X") return depth - 10; // Player Win
  if (currentBoard.every((cell) => cell !== null)) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < currentBoard.length; i++) {
		if (currentBoard[i] === null) {
			currentBoard[i] = "O";
			const score = minimax(currentBoard, depth + 1, false);
			currentBoard[i] = null;
			bestScore = Math.max(score, bestScore);
		}
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < currentBoard.length; i++) {
		if (currentBoard[i] === null) {
			currentBoard[i] = "X";
			const score = minimax(currentBoard, depth + 1, true);
			currentBoard[i] = null;
			bestScore = Math.min(score, bestScore);
		}
    }
    return bestScore;
  }
};

const TicTacToe = () => {
	const { user } = useUser();
	const [board, setBoard] = useState(Array(9).fill(null));
	const [isPlayerTurn, setIsPlayerTurn] = useState(true);
	const [message, setMessage] = useState("");
	const [playerScore, setPlayerScore] = useState(0);
	const [consecutiveWins, setConsecutiveWins] = useState(0);
	const [isHardMode, setIsHardMode] = useState(false);
	const [gameOver, setGameOver] = useState<boolean>(false);

	useEffect(() => {
		if (user) {
		fetch("/api/user")
			.then((res) => {
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				return res.json();
			})
			.then((data) => {
				setPlayerScore(data.user.score || 0);
				setConsecutiveWins(data.user.consecutiveWins || 0);
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
		}
	}, [user]);

	const isHardModeRef = useRef<boolean>(isHardMode);
	useEffect(() => {
		isHardModeRef.current = isHardMode;
	}, [isHardMode]);

	const easyBotMove = useCallback((currentBoard: BoardType) => {
		const availableMoves = currentBoard
		.map((value, index) => (value === null ? index : null))
		.filter((val) => val !== null) as number[];

    	if (availableMoves.length === 0) return;

    	const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    	const newBoard = [...currentBoard];
    	newBoard[randomMove] = "O";
    	setBoard(newBoard);
    	setIsPlayerTurn(true);
	}, []);

	const hardBotMove = useCallback((currentBoard: BoardType) => {
		let bestScore = -Infinity;
		let bestMove = -1;

    	for (let i = 0; i < currentBoard.length; i++) {
			if (currentBoard[i] === null) {
				currentBoard[i] = "O";
				const score = minimax(currentBoard, 0, false);
				currentBoard[i] = null;
				if (score > bestScore) {
					bestScore = score;
					bestMove = i;
				}
			}
    	}

		if (bestMove !== -1) {
			const newBoard = [...currentBoard];
			newBoard[bestMove] = "O";
			setBoard(newBoard);
			setIsPlayerTurn(true);
		}
  	}, []);

	const botMove = useCallback(
		(currentBoard: BoardType) => {
			if (isHardModeRef.current) {
				hardBotMove(currentBoard);
			} else {
				easyBotMove(currentBoard);
			}
	}, [hardBotMove, easyBotMove]);

	const handlePlayerMove = (index: number) => {
		if (isPlayerTurn && board[index] === null && !gameOver) {
			const newBoard = [...board];
			newBoard[index] = "X";
			setBoard(newBoard);
			setIsPlayerTurn(false);
		}
	};

  
  	useEffect(() => {
    	if (gameOver) return;

    	const winner = checkWinner(board);

    	if (winner) {
      		setGameOver(true);
			if (winner === "X") {
				setMessage("คุณชนะ!");
				setPlayerScore((prevScore) => prevScore + 1);

				setConsecutiveWins((prevWins) => {
					const newWins = prevWins + 1;
					return newWins;
				});
			} else if (winner === "O") {
				setMessage("Bot ชนะ!");
				setPlayerScore((prevScore) => prevScore - 1); 
				setConsecutiveWins(0); 
			}
    	} else if (board.every((cell) => cell !== null)) {
			setGameOver(true);
			setMessage("เกมเสมอ!");
			setConsecutiveWins(0);
    	} else {
			if (isPlayerTurn) {
				setMessage("ตาของคุณ (X)");
      		} else {
				setMessage("Bot กำลังคิด...");
				const timer = setTimeout(() => {
					botMove(board);
				}, 1000);
			return () => clearTimeout(timer); 
			}
    	}
  	}, [board, isPlayerTurn, botMove, gameOver]);

  
  	useEffect(() => {
		if (consecutiveWins === 3) {
			setPlayerScore((prevScore) => prevScore + 1);
			setConsecutiveWins(0);
			setMessage("คุณได้รับคะแนนพิเศษ!"); 
		}
		if (gameOver) {
			updateScore(playerScore, consecutiveWins);
		}
  	}, [playerScore, consecutiveWins, gameOver]);

  	const updateScore = async (
		scoreDelta: number,
		consecutiveWinsDelta: number
  	) => {
		try {
			const response = await fetch("/api/user/update-score", {
				method: "POST",
				headers: {
				"Content-Type": "application/json",
			},
				body: JSON.stringify({ scoreDelta, consecutiveWinsDelta }),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to update score");
			}
		} catch (error) {
			console.error("Error updating score:", error);
		}
  	};
	
	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setIsPlayerTurn(true);
		setMessage("");
		setGameOver(false);
	};

	const handleModeChange = () => {
		setIsHardMode(!isHardMode);
		setIsPlayerTurn(true);
	};

  	return (
    	<div className="flex flex-col bg-background items-center justify-center min-h-screen p-4">

			<div className="mb-4 flex items-center space-x-4">
				<div className="flex flex-col justify-center items-center w-40 h-40 text-3xl font-semibold rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md transition duration-200">
					<p className="text-xl text-foreground font-medium">
						คะแนน: 
					</p>
					<h2 className="text-6xl text-foreground font-bold mt-3">{playerScore}</h2>
				</div>
				<div className="flex flex-col justify-center items-center w-40 h-40 text-3xl font-semibold rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md transition duration-200">
				<p className="text-lg text-foreground">
					ชนะติดต่อกัน:
				</p>
				<h2 className="text-6xl text-foreground font-bold mt-3">{consecutiveWins}</h2>
				</div>
			</div>

			<div className="flex items-center mt-4">
				<label htmlFor="botMode" className="mr-2 text-lg text-foreground">
					โหมดบอท:
				</label>
				<Switch 
					checked={isHardMode}
					onCheckedChange={handleModeChange}
				/>
				<span className="ml-2 text-foreground">
					{isHardMode ? "ยาก" : "ง่าย"}
				</span>
			</div>

			<div className="grid grid-cols-3 gap-4 mt-6">
				{board.map((value, index) => (
					<button
						key={index}
						onClick={() => handlePlayerMove(index)}
						className={`w-24 h-24 text-3xl font-semibold rounded-lg bg-secondary shadow-md transition duration-200 ${
						value === "X"
							? "text-red-500"
							: value === "O"
							? "text-green-500"
							: "text-primary hover:bg-primary"
						}`}
						disabled={!isPlayerTurn || value !== null || gameOver}
					>
						{value}
					</button>
				))}
			</div>
			<p className="mt-6 text-xl text-white font-medium">{message}</p>
			{gameOver && (
				<button
					onClick={resetGame}
					className="mt-4 px-6 py-2 bg-primary text-white rounded-full shadow-lg hover:bg-violet-800 transition duration-200"
				>
					เริ่มเกมใหม่
				</button>
			)}
    	</div>
  	);
};

export default TicTacToe;
