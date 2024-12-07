import "./index.css";
import { languages } from "./components/languages";
import React from "react";
import clsx from "clsx";
import { chooseRandomWord, getFarewellText } from "./components/utils";
import Confetti from "react-confetti";

export default function App() {
  //word to guess
  const [word, setWord] = React.useState(() =>
    chooseRandomWord().toUpperCase()
  );
  //guessed letters
  const [guessedLetters, setGuessedLetters] = React.useState([]);
  //wrong answers
  const [wrongLetter, setWrongLetter] = React.useState("");

  const numGuessesLeft = languages.length - 1;
  let wrongGuesses = guessedLetters.filter(
    (letter) => !word.includes(letter)
  ).length;

  let isGameWon = word
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  let isGameLost = wrongGuesses >= languages.length - 1 && true;
  let isGameDone = isGameLost || isGameWon;

  //LANGUAGES
  const languageElements = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuesses;
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    };
    return (
      <span
        className={clsx("language", {
          lost: isLanguageLost, // Add the 'lost' class dynamically
        })}
        key={language.name}
        style={styles}
      >
        {language.name}
      </span>
    );
  });

  //GUESSING WORD
  const wordArray = word.split("").map((letter, index) => {
    const isRevealed = isGameLost && !guessedLetters.includes(letter);
    return (
      <span
        key={index}
        className={clsx("letter", {
          revealed: isRevealed, // Apply the 'revealed' class for unguessed letters
        })}
      >
        {(guessedLetters.includes(letter) || isGameLost) && letter}
      </span>
    );
  });

  //KEYBOARD INPUTS
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const keyboard = alphabet
    .toUpperCase()
    .split("")
    .map((letter) => {
      return (
        <button
          onClick={() => guessLetter(letter)}
          key={letter}
          disabled={isGameDone}
          aria-disabled={guessedLetters.includes(letter)}
          aria-label={`Letter ${letter}`}
          className={clsx("alphabet-letter", {
            "correct-selected-letter":
              guessedLetters.includes(letter) && word.includes(letter),
            "incorrect-selected-letter":
              guessedLetters.includes(letter) && !word.includes(letter),
          })}
        >
          {letter}
        </button>
      );
    });

  function guessLetter(letter) {
    if (!word.includes(letter)) {
      setWrongLetter(letter);
    }
    setGuessedLetters((prevLetters) => {
      const lettersSet = new Set(prevLetters);
      lettersSet.add(letter);
      return Array.from(lettersSet);
    });
  }

  function renderGameStatus() {
    if (isGameWon) {
      return (
        <section className="game-status">
          <h1>You Win!</h1>
          <p>Well done! 🎉</p>
        </section>
      );
    } else if (isGameLost) {
      return (
        <section className="game-status gameover">
          <h1>Game Over!</h1>
          <p>Now we all have to learn assembly...Thanks...</p>
        </section>
      );
    }
    if (!word.includes(wrongLetter)) {
      return (
        <section className="game-status farewell">
          <p>{getFarewellText(languageElements[wrongGuesses - 1].key)} 🖖</p>
        </section>
      );
    }
    if (!isGameDone) {
      return (
        <section className="game-status empty">
          <h1></h1>
          <p></p>
        </section>
      );
    }
  }

  function resetGame() {
    setWord(chooseRandomWord().toUpperCase()); // Set a new random word
    setGuessedLetters([]); // Clear guessed letters
    setWrongLetter(""); // Reset the last wrong letter
  }

  return (
    <>
      {isGameWon && <Confetti />}
      <header className="game-area">
        <h1 className="game-info">Assembly: Endgame</h1>
        <p className="game-title">
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      {renderGameStatus()}
      <section className="language-list">{languageElements}</section>
      <section className="word">{wordArray}</section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section aria-live="polite" role="status" className="sr-only">
        <p>
          {word.includes(wrongLetter)
            ? `Correct! The letter ${wrongLetter} is in the word.`
            : `Sorry, the letter ${wrongLetter} is not in the word.`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          Current word:{" "}
          {word
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank"
            )
            .join(" ")}
        </p>
      </section>

      <section className="alphabet-keyboard">{keyboard}</section>
      {isGameDone && (
        <button onClick={resetGame} className="new-game">
          New Game
        </button>
      )}
    </>
  );
}
