import React, { Component } from "react";
import Game from "./components/Game";
import "./App.css";

class App extends Component {
  renderParticles() {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${6 + Math.random() * 8}s`,
        animationDelay: `${Math.random() * 6}s`,
        width: `${2 + Math.random() * 3}px`,
        height: `${2 + Math.random() * 3}px`,
        opacity: 0.2 + Math.random() * 0.3,
      };
      particles.push(<div key={i} className="particle" style={style} />);
    }
    return particles;
  }

  render() {
    return (
      <div className="app">
        <div className="particles">{this.renderParticles()}</div>

        <header className="header">
          <h1>WORD RUSH</h1>
          <div className="header-subtitle">Unscramble the letters</div>
        </header>

        <Game />
      </div>
    );
  }
}

export default App;
