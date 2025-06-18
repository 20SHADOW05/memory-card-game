import { useEffect, useState } from 'react';
import './index.css';

function Loading() {
  return (
    <div className="wrapper">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
    </div>
  );
}

function MemoryGame() {
  let [char, setChar] = useState(null);
  let [clickedChar, setClickedChar] = useState([]);
  let [isShuffling, setIsShuffling] = useState(false);
  let [Score, setScore] = useState(0);
  let [bestScore, setBestScore] = useState(0);
  let [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    fetch('https://dattebayo-api.onrender.com/characters', { mode: 'cors' })
      .then(function (response) {
        return response.json();
      })
      .then(function (res) {
        if (!res.characters) {
          throw new Error('Not found.');
        }
        let filteredChar = res.characters.filter(
          (item) =>
            item.name !== 'Jiraiya' &&
            item.name !== 'Boruto Uzumaki' &&
            item.name !== 'Konohamaru Sarutobi' &&
            item.name !== 'Mitsuki'
        );
        const initialCards = shuffleArray(filteredChar).slice(0, 12);
        setChar(initialCards);
      })
      .catch((error) => {
        console.error('Error fetching characters:', error);
      });
  }, []);

  function cardCheck(cardname) {
    for (let i = 0; i < clickedChar.length; i++) {
      if (clickedChar[i] === cardname) {
        return true;
      }
    }
    return false;
  }

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function clickHandler(newValue) {
    if (cardCheck(newValue)) {
      if (Score > bestScore) setBestScore(Score);
      setScore(0);
      setGameEnded(true);
      setClickedChar([]);
      return;
    } else {
      setClickedChar([...clickedChar, newValue]);
      setIsShuffling(true);
      setScore(Score + 1);
      setTimeout(() => {
        const newChar = shuffleArray(char);
        setChar(newChar);
        setIsShuffling(false);
      }, 700);
    }
  }

  function restartGame() {
    setClickedChar([]);
    setScore(0);
    setGameEnded(false);
  }

  return (
    <div>
      <div className="header">
        <div className="title">Memory Card</div>
        <div className="score">
          <p>Score : {Score}</p>
          <p>Best Score : {bestScore}</p>
        </div>
      </div>

      <div className="images">
        {char ? (
          gameEnded ? (
            <div className="end-game">
              <p className="end">Game ended!</p>
              <button onClick={restartGame}>Restart</button>
            </div>
          ) : isShuffling ? (
            <Loading />
          ) : (
            char.map((item) => (
              <div
                key={item.name}
                className="image-wrapper"
                onClick={() => clickHandler(item.name)}
              >
                <img src={item.images[0]} alt={item.name} />
              </div>
            ))
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default MemoryGame;
