import React from 'react';

const Letter = ({ letter, index, clicked, clickHandler }) => {
  return (
    <button
      className={`letter-tile ${clicked ? 'used' : ''}`}
      disabled={clicked}
      onClick={() => clickHandler(index)}
      aria-label={`Letter ${letter}`}
    >
      {letter}
    </button>
  );
};

export default Letter;
