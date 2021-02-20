// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
//     import socket from "./socket"
//
import "phoenix_html"

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';
import 'milligram';
import { ch_join, ch_push,
    ch_login, ch_reset } from './socket';

function App() {

    useEffect(() => {
        ch_join(setGameObject);
    });
    
  var initGameObject = {
    answer: [],
    guesses: [],
    guess: "",
    bulls: 0,
    cows: 0,
    wonMsg: "",
    hasWon: false
  };

  const [gameObject, setGameObject] = useState(initGameObject);

  // using sets for answers since the sets cannot contain dups
//   const [answer, setAnswer] = useState([]);
//   const [guesses, setGuesses] = useState([]);
//   const [guess, setGuess] = useState("");
//   const [bulls, setBulls] = useState(0);
//   const [cows, setCows] = useState(0);
//   const [wonMsg, setWonMsg] = useState("");

  function newGame() {
      ch_push({});
    // var tempAnswer = new Set([]);
    // while (tempAnswer.size < 4) {
    //   const rand = Math.floor(Math.random() * 9);
    //   tempAnswer.add(Math.floor(Math.random() * 9));
    // }
    // console.log("Answer: ", tempAnswer);

    // const newGameObject = Object.assign({}, gameObject);
    // newGameObject.answer = Array.from(tempAnswer);
    // newGameObject.wonMsg = "";
    // newGameObject.guesses = [];
    // newGameObject.guess = "";
    // newGameObject.hasWon = false;
    // setGameObject(newGameObject);
  }

  // taken from stack overflow: 
  // https://stackoverflow.com/questions/7376598/in-javascript-how-do-i-check-if-an-array-has-duplicate-values
  function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

  function updateGuess(aGuess) {
    let guessN = aGuess.target.value;
    var guessAsArray = Array.from(guessN);
    if (!hasDuplicates(guessAsArray) && !isNaN(guessN)) {
      console.log(aGuess.target.value);
        ch_push({view: guessN});
        // const newGameObject = Object.assign({}, gameObject);
        // newGameObject.guess = guessN;
        // setGameObject(newGameObject);
    } 
  }

  function keyPress(event) {
    if (event.key == "Enter") {
      submitGuess();
    }
  }

  function submitGuess() {
      console.log(gameObject.guess);
      ch_push({guess: gameObject.guess});

    // if (gameObject.answer.length == 0) {
    //     const newGameObject = Object.assign({}, gameObject);
    //     newGameObject.wonMsg = "No answer has been created. Press new game.";
    //     setGameObject(newGameObject);
    // } else if (gameObject.guesses.length >= 8) {
    //     const newGameObject = Object.assign({}, gameObject);
    //     newGameObject.wonMsg = "Game Over! You have spent all 8 guesses. Press new game.";
    //     setGameObject(newGameObject);
    // } else if (gameObject.hasWon) {
    //     const newGameObject = Object.assign({}, gameObject);
    //     newGameObject.wonMsg = "Congratulations! You have guessed the number. Press new game.";
    //     setGameObject(newGameObject);
    // } else {
    //     if (gameObject.guess.length == 4) {

    //         console.log("guess to be added: ", gameObject.guess);
    //         checkGuess(Array.from(gameObject.guess.toString()).map(Number));
    //         //   setGameObject(newGameObject);
    //       }
    //       else {
    //           const newGameObject = Object.assign({}, gameObject);
    //           newGameObject.guess = "";
    //           setGameObject(newGameObject);
    //     }
    // }
  }

  // guessN: Array
  function checkGuess(guessN) {
    // var guessN = Array.from(guess);
    // console.log("guess is: ", guessN);
    // console.log("answer is: ", answer);
    var bullsTemp = 0;
    var cowsTemp = 0;
    var i;

    for (i = 0; i < 4; i++) {
      if (guessN[i] == gameObject.answer[i]) {
        // console.log("a bull found");
        bullsTemp = bullsTemp + 1;
      } else {
        var restOfAnswer = [...gameObject.answer];
        restOfAnswer.splice(i, 1);
        // console.log("value compared: ", guessN[i]);
        // console.log("rest of answer: ", restOfAnswer);
        if (restOfAnswer.includes(guessN[i])) {
          cowsTemp = cowsTemp + 1;
          // console.log("a cow found");
        }
      }
    }

    const newGameObject = Object.assign({}, gameObject);
    console.log(newGameObject.guesses);
    console.log(newGameObject.guesses.length);

    if (bullsTemp == 4) {
        newGameObject.wonMsg = "Congratulations! You have guessed the number.";
        newGameObject.hasWon = true;
    } else if (newGameObject.guesses.length >= 7) {
        newGameObject.wonMsg = "Game Over! You have spent all 8 guesses.";
    }

    newGameObject.bulls = bullsTemp;
    newGameObject.cows = cowsTemp;
    console.log("[Bulls][Cows]", newGameObject.bulls, newGameObject.cows);

    var curGuesses = Array.from(gameObject.guesses);
    curGuesses.push([newGameObject.guess, newGameObject.bulls, newGameObject.cows]);
    // curGuesses.unshift(Array.from(gameObject.guess.toString()).map(Number));
    // var guessesBC = Array(curGuesses);
    // guessesBC.push(Array.from(gameObject.bulls));
    // guessesBC.push(Array.from(gameObject.cows));

    console.log("updated guesses: ", curGuesses);
    newGameObject.guesses = curGuesses;
    newGameObject.guess = "";
    setGameObject(newGameObject);
  }
  
  function getGuess(index) {
    if (gameObject.guesses.length > index) {
      return gameObject.guesses[index][0];
    }
  }

  function getBulls(index) {
    if (gameObject.guesses.length > index) {
      return gameObject.guesses[index][1];
    }
  }
  
  function getCows(index) {
    if (gameObject.guesses.length > index) {
      return gameObject.guesses[index][2];
    }
  }


  return (
    <div className="App">
      <h1>4Digits Game</h1>
      <p>{gameObject.wonMsg}</p>
      <p>(Temp) Answer: {gameObject.answer}</p>
      <p>
        <button onClick={newGame}>
          New Game
        </button>
      </p>
      <p>
        <input type="text"
               value={gameObject.guess}
               maxLength={4}
               onChange={updateGuess}
               onKeyPress={(keyPress)}/>
        <button onClick={submitGuess}>
          Guess
        </button>
      </p>
      <p>Bulls: {gameObject.bulls}  Cows: {gameObject.cows}</p>
      <table id="records">
        <tbody>
          <tr>
            <td>Guess #</td>
            <td>Guess</td>
            <td>Bulls</td>
            <td>Cows</td>
          </tr>
          <tr>
            <td>1</td>
            <td>{getGuess(0)}</td>
            <td>{getBulls(0)}</td>
            <td>{getCows(0)}</td>
          </tr>
          <tr>
            <td>2</td>
            <td>{getGuess(1)}</td>
            <td>{getBulls(1)}</td>
            <td>{getCows(1)}</td>
          </tr>
          <tr>
            <td>3</td>
            <td>{getGuess(2)}</td>
            <td>{getBulls(2)}</td>
            <td>{getCows(2)}</td>
          </tr>
          <tr>
            <td>4</td>
            <td>{getGuess(3)}</td>
            <td>{getBulls(3)}</td>
            <td>{getCows(3)}</td>
          </tr>
          <tr>
            <td>5</td>
            <td>{getGuess(4)}</td>
            <td>{getBulls(4)}</td>
            <td>{getCows(4)}</td>
          </tr>
          <tr>
            <td>6</td>
            <td>{getGuess(5)}</td>
            <td>{getBulls(5)}</td>
            <td>{getCows(5)}</td>
          </tr>
          <tr>
            <td>7</td>
            <td>{getGuess(6)}</td>
            <td>{getBulls(6)}</td>
            <td>{getCows(6)}</td>
          </tr>
          <tr>
            <td>8</td>
            <td>{getGuess(7)}</td>
            <td>{getBulls(7)}</td>
            <td>{getCows(7)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);