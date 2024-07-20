const GameBoard = (() => {
  let board = Array(9).fill(null);

  const getBoard = () => board;

  const makeMove = (index, player) => {
      if (board[index] === null) {
          board[index] = player;
          return true;
      }
      return false;
  };

  const reset = () => {
      board = Array(9).fill(null);
  };

  return { getBoard, makeMove, reset };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  const start = (player1Name, player2Name) => {
      players = [
          Player(player1Name, 'X'),
          Player(player2Name, 'O')
      ];
      currentPlayerIndex = 0;
      gameOver = false;
      GameBoard.reset();
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const switchPlayer = () => {
      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const makeMove = (index) => {
      if (!gameOver && GameBoard.makeMove(index, getCurrentPlayer().marker)) {
          if (checkWinner()) {
              gameOver = true;
              return `${getCurrentPlayer().name} wins!`;
          } else if (checkTie()) {
              gameOver = true;
              return "It's a tie!";
          } else {
              switchPlayer();
              return `${getCurrentPlayer().name}'s turn`;
          }
      }
      return null;
  };

  const checkWinner = () => {
      const winPatterns = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
          [0, 4, 8], [2, 4, 6] // Diagonals
      ];

      return winPatterns.some(pattern => {
          const [a, b, c] = pattern;
          return GameBoard.getBoard()[a] &&
                 GameBoard.getBoard()[a] === GameBoard.getBoard()[b] &&
                 GameBoard.getBoard()[a] === GameBoard.getBoard()[c];
      });
  };

  const checkTie = () => {
      return GameBoard.getBoard().every(cell => cell !== null);
  };

  return { start, makeMove, getCurrentPlayer };
})();

const DisplayController = (() => {
  const boardDiv = document.getElementById('game-board');
  const statusDiv = document.getElementById('game-status');
  const startButton = document.getElementById('start-game');
  const restartButton = document.getElementById('restart-game');
  const player1Input = document.getElementById('player1');
  const player2Input = document.getElementById('player2');

  const updateBoard = () => {
      boardDiv.innerHTML = '';
      GameBoard.getBoard().forEach((cell, index) => {
          const cellButton = document.createElement('button');
          cellButton.classList.add('cell');
          cellButton.textContent = cell || '';
          cellButton.addEventListener('click', () => {
              const result = GameController.makeMove(index);
              if (result) {
                  updateBoard();
                  updateStatus(result);
                  if (result.includes('wins') || result.includes('tie')) {
                      restartButton.style.display = 'inline-block';
                  }
              }
          });
          boardDiv.appendChild(cellButton);
      });
  };

  const updateStatus = (message) => {
      statusDiv.textContent = message;
  };

  startButton.addEventListener('click', () => {
      const player1Name = player1Input.value || 'Player 1';
      const player2Name = player2Input.value || 'Player 2';
      GameController.start(player1Name, player2Name);
      updateBoard();
      updateStatus(`${player1Name}'s turn`);
      startButton.style.display = 'none';
      player1Input.style.display = 'none';
      player2Input.style.display = 'none';
  });

  restartButton.addEventListener('click', () => {
      startButton.style.display = 'inline-block';
      player1Input.style.display = 'inline-block';
      player2Input.style.display = 'inline-block';
      restartButton.style.display = 'none';
      statusDiv.textContent = '';
      boardDiv.innerHTML = '';
  });

  return { updateBoard, updateStatus };
})();