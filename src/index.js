import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let squareClass = this.props.winningSquares
      ? this.props.winningSquares.includes(i)
        ? "square winning-square"
        : "square"
      : "square";
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={squareClass}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      isXNext: true,
    };
  }

  handleClick(i) {
    // early return if game is over
    let currLen = this.state.history.length;
    let currSquares = this.state.history[currLen - 1].squares;
    if (calculateWinner(currSquares) || currSquares[i]) {
      return;
    }

    this.setState((prevState) => {
      let len = prevState.history.length;
      let updatedSquares = [...prevState.history[len - 1].squares];
      let updatedHistory = [...prevState.history];

      updatedSquares[i] = prevState.isXNext ? "X" : "O";
      updatedHistory.push({ squares: updatedSquares });
      return {
        history: updatedHistory,
        isXNext: !prevState.isXNext,
      };
    });
  }

  goToMove(moveNum) {
    this.setState({
      history: this.state.history.slice(0, moveNum + 1),
      isXNext: moveNum % 2 === 0,
    });
  }

  render() {
    const currentSquares = this.state.history[this.state.history.length - 1]
      .squares;
    let status;
    let winningSquares = calculateWinner(currentSquares);
    let winner = winningSquares ? currentSquares[winningSquares[0]] : null;

    if (winner) {
      status = "Congrats! Winner is player " + winner;
    } else {
      status = "Next player: " + (this.state.isXNext ? "X" : "O");
    }

    const moveHistory = this.state.history.map((moves, moveNum) => {
      const moveDesc =
        "Go to " + (moveNum > 0 ? "move #" + moveNum : "the start");
      return (
        <li key={moves.squares}>
          <button onClick={() => this.goToMove(moveNum)}>{moveDesc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentSquares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moveHistory}</ol>
        </div>
      </div>
    );
  }
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
      return [a, b, c];
    }
  }
  return null;
}

ReactDOM.render(<Game />, document.getElementById("root"));
