import React, { Component } from "react";
import Letter from "./Letter";

function shuffleWord(word) {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

class Words extends Component {
  state = {
    shuffled: "",
    clicked: [],
    wordFormed: "",
    indexClicked: [],
    word: "",
    shaking: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.word !== nextProps.word) {
      let shuff = shuffleWord(nextProps.word);
      while (shuff === nextProps.word) {
        shuff = shuffleWord(nextProps.word);
      }
      const clickedArr = new Array(nextProps.word.length).fill(false);

      return {
        word: nextProps.word,
        shuffled: shuff,
        clicked: clickedArr,
        wordFormed: "",
        indexClicked: [],
        shaking: false,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    const key = e.key.toUpperCase();

    if (key === "BACKSPACE") {
      e.preventDefault();
      this.clearLast();
      return;
    }

    if (key.length !== 1 || key < "A" || key > "Z") return;

    const { shuffled, clicked } = this.state;
    for (let i = 0; i < shuffled.length; i++) {
      if (!clicked[i] && shuffled[i] === key) {
        this.letterClicked(i);
        return;
      }
    }
  };

  letterClicked = (index) => {
    if (this.state.clicked[index] || this.state.shaking) return;

    const newWord = this.state.wordFormed + this.state.shuffled.charAt(index);
    const clickedArr = [...this.state.clicked];
    clickedArr[index] = true;
    const clickedIndex = [...this.state.indexClicked, index];

    this.setState({
      clicked: clickedArr,
      wordFormed: newWord,
      indexClicked: clickedIndex,
    });

    if (this.state.word.length === newWord.length) {
      if (this.state.word === newWord) {
        this.props.next();
      } else {
        this.wrongAnswer();
      }
    }
  };

  wrongAnswer = () => {
    this.setState({ shaking: true });
    setTimeout(() => {
      const clickedArr = new Array(this.state.word.length).fill(false);
      this.setState({
        clicked: clickedArr,
        wordFormed: "",
        indexClicked: [],
        shaking: false,
      });
    }, 500);
  };

  clearLast = () => {
    if (this.state.wordFormed.length === 0 || this.state.shaking) return;

    const lastIndex = this.state.indexClicked[this.state.indexClicked.length - 1];
    const newWord = this.state.wordFormed.slice(0, -1);
    const clickedArr = [...this.state.clicked];
    clickedArr[lastIndex] = false;
    const newIndexArr = this.state.indexClicked.slice(0, -1);

    this.setState({
      clicked: clickedArr,
      wordFormed: newWord,
      indexClicked: newIndexArr,
    });
  };

  render() {
    const { shuffled, clicked, wordFormed, word, shaking } = this.state;
    const slots = word.split("");
    const isEmpty = wordFormed.length === 0;

    return (
      <div className="words-container">
        <div className="letters-row">
          {shuffled.split("").map((character, index) => (
            <Letter
              key={`${word}-${index}`}
              index={index}
              letter={character}
              clicked={clicked[index]}
              clickHandler={this.letterClicked}
            />
          ))}
        </div>

        <div className={`word-display ${shaking ? 'shake' : ''}`}>
          {slots.map((_, index) => (
            <div
              key={`slot-${word}-${index}`}
              className={`word-slot ${index < wordFormed.length ? 'filled' : ''}`}
            >
              {index < wordFormed.length ? wordFormed[index] : ''}
            </div>
          ))}
        </div>

        <div className="actions-row">
          <button
            className={`clear-btn ${isEmpty ? 'disabled' : ''}`}
            onClick={this.clearLast}
          >
            ← Undo
          </button>
        </div>

        <div className="keyboard-hint">
          Type letters or click tiles
        </div>
      </div>
    );
  }
}

export default Words;
