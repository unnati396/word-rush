import React, { Component } from 'react';
import Words from './Words';
import wordArr from '../data/words.json';

const WORDS_PER_LEVEL = 5;
const INITIAL_TIME = 30;
const HIGH_SCORE_KEY = 'wordRushHighScore';

function getHighScore() {
  try {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10) || 0;
  } catch (e) {
    return 0;
  }
}

function saveHighScore(score) {
  try {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem(HIGH_SCORE_KEY, score);
      return true;
    }
  } catch (e) { /* localStorage unavailable */ }
  return false;
}

class Game extends Component {
  state = {
    level: 1,
    score: 0,
    currentIndex: 0,
    shuffledWords: [],
    timer: INITIAL_TIME,
    maxTimer: INITIAL_TIME,
    win: false,
    gameOver: false,
    currentWord: '',
    levelChange: false,
    wordsInLevel: 0,
    prevScore: 0,
    highScore: getHighScore(),
    isNewHighScore: false,
    transitioning: false,
  };

  timerInterval = null;

  componentDidMount() {
    const shuffledArr = this.shuffle(wordArr[0]);
    const current = shuffledArr[0].toUpperCase();
    this.setState({ shuffledWords: shuffledArr, currentWord: current });
    this.startTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  startTimer = () => {
    this.clearTimer();
    this.timerInterval = setInterval(this.reduceTimer, 1000);
  };

  clearTimer = () => {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  };

  reduceTimer = () => {
    this.setState(prevState => {
      if (prevState.timer <= 1) {
        this.clearTimer();
        const isNew = saveHighScore(prevState.score);
        return {
          timer: 0,
          gameOver: true,
          isNewHighScore: isNew,
          highScore: Math.max(prevState.highScore, prevState.score),
        };
      }
      return { timer: prevState.timer - 1 };
    });
  };

  shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  nextWord = () => {
    const { currentIndex, shuffledWords, level, score, timer, wordsInLevel } = this.state;

    if (currentIndex + 1 >= shuffledWords.length && level >= 4) {
      this.clearTimer();
      const isNew = saveHighScore(score + 1 * level);
      this.setState({
        win: true,
        score: score + 1 * level,
        isNewHighScore: isNew,
        highScore: Math.max(this.state.highScore, score + 1 * level),
      });
      return;
    }

    const nextWordsInLevel = wordsInLevel + 1;

    this.setState({ transitioning: true });

    setTimeout(() => {
      if (nextWordsInLevel >= WORDS_PER_LEVEL && level < 4) {
        const shuffledArr = this.shuffle(wordArr[level]);
        const current = shuffledArr[0].toUpperCase();
        const newLevel = level + 1;
        const timeBonus = 10 * level;
        const scoreBonus = 1 * level;
        const newTime = timer + timeBonus;

        this.setState({
          shuffledWords: shuffledArr,
          currentIndex: 0,
          currentWord: current,
          level: newLevel,
          timer: newTime,
          maxTimer: newTime,
          prevScore: score,
          score: score + scoreBonus,
          levelChange: true,
          wordsInLevel: 0,
          transitioning: false,
        });

        setTimeout(() => this.setState({ levelChange: false }), 1500);
      } else {
        const nextIndex = currentIndex + 1;
        const scoreBonus = 1 * level;
        const current = shuffledWords[nextIndex].toUpperCase();
        const newTime = timer + 2;

        this.setState({
          currentIndex: nextIndex,
          timer: newTime,
          maxTimer: Math.max(this.state.maxTimer, newTime),
          currentWord: current,
          prevScore: score,
          score: score + scoreBonus,
          wordsInLevel: nextWordsInLevel,
          transitioning: false,
        });
      }
    }, 300);
  };

  playAgain = () => {
    const shuffledArr = this.shuffle(wordArr[0]);
    const current = shuffledArr[0].toUpperCase();
    this.setState({
      level: 1,
      score: 0,
      prevScore: 0,
      currentIndex: 0,
      shuffledWords: shuffledArr,
      timer: INITIAL_TIME,
      maxTimer: INITIAL_TIME,
      win: false,
      gameOver: false,
      currentWord: current,
      levelChange: false,
      wordsInLevel: 0,
      isNewHighScore: false,
      transitioning: false,
      highScore: getHighScore(),
    });
    this.startTimer();
  };

  render() {
    const {
      timer, maxTimer, level, score, prevScore,
      gameOver, win, levelChange, currentWord,
      wordsInLevel, highScore, isNewHighScore, transitioning,
    } = this.state;

    const scorePop = score !== prevScore ? 'score-pop' : '';
    const timerPercent = maxTimer > 0 ? (timer / maxTimer) * 100 : 0;
    const timerDanger = timer < 10;
    const timerCritical = timer < 5;

    // ===== WIN SCREEN =====
    if (win) {
      return (
        <div className="game-container">
          <div className="win-screen">
            <div className="win-emoji"><span role="img" aria-label="trophy">🏆</span></div>
            <div className="win-title">YOU WIN!</div>
            <div className="game-over-score">
              <span className="score-number">{score}</span>
              <div className="score-label">Final Score</div>
            </div>
            {isNewHighScore && (
              <div className="new-high-score">
                <span role="img" aria-label="star">⭐</span> New High Score!
              </div>
            )}
            <div className="high-score-display">Best: {highScore}</div>
            <button className="play-again-btn" onClick={this.playAgain}>
              Play Again
            </button>
          </div>
        </div>
      );
    }

    // ===== GAME OVER SCREEN =====
    if (gameOver) {
      return (
        <div className="game-container">
          <div className="game-over">
            <div className="game-over-title">GAME OVER</div>
            <div className="game-over-score">
              <span className="score-number">{score}</span>
              <div className="score-label">Your Score</div>
            </div>
            {isNewHighScore && (
              <div className="new-high-score">
                <span role="img" aria-label="star">⭐</span> New High Score!
              </div>
            )}
            <div className="high-score-display">Best: {highScore}</div>
            <div className="game-over-word">
              The word was: <span>{currentWord}</span>
            </div>
            <button className="play-again-btn" onClick={this.playAgain}>
              Play Again
            </button>
          </div>
        </div>
      );
    }

    // ===== ACTIVE GAME =====
    return (
      <div className="game-container">
        {levelChange && (
          <div className="level-up-overlay">
            <div className="level-up-badge">Level Complete</div>
            <div className="level-up-text">Level {level}!</div>
            <div className="level-up-stars"><span role="img" aria-label="celebration">✨ 🚀 ✨</span></div>
          </div>
        )}

        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-label">Time</span>
            <span className={`stat-value timer ${timerDanger ? 'danger' : ''}`}>
              {timer}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Level</span>
            <span className="stat-value level">{level}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Score</span>
            <span className={`stat-value score ${scorePop}`} key={score}>
              {score}
            </span>
          </div>
          <div className="stat-card stat-card-small">
            <span className="stat-label">Best</span>
            <span className="stat-value high">{highScore}</span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="timer-bar-container">
          <div
            className={`timer-bar-fill ${timerDanger ? 'danger' : ''} ${timerCritical ? 'critical' : ''}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Word count + level progress */}
        <div className="word-counter">
          <span className="word-counter-text">
            Word {wordsInLevel + 1} of {WORDS_PER_LEVEL}
          </span>
          <div className="level-progress-dots">
            {Array.from({ length: WORDS_PER_LEVEL }).map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i < wordsInLevel ? 'done' : ''} ${i === wordsInLevel ? 'current' : ''}`}
              />
            ))}
          </div>
        </div>

        {!levelChange && (
          <div className={`words-wrapper ${transitioning ? 'word-exit' : 'word-enter'}`}>
            <Words word={currentWord} next={this.nextWord} />
          </div>
        )}
      </div>
    );
  }
}

export default Game;
