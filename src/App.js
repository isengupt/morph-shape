
import './App.css';
import Scene from './Scene'

function App() {
  return (
    <>
    <div className="frame">
    <h1 className="frame__title">Shape Morphing Demo</h1>
    <div className="frame__links"></div>
    <div className="frame__nav">
      <a
        className="frame__link"
        href="https://isengupt.github.io/noise-morph/"
      >
        Previous
      </a>
      <a className="frame__link" href="#">
        Resume
      </a>
      <a
        className="frame__link"
        href="https://github.com/isengupt/morph-shape/"
      >
        GitHub
      </a>
    </div>
  </div>
     <Scene/>
     </>

  );
}

export default App;
