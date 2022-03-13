import React, { useEffect, useState } from 'react';
import './assets/css/styles.css';
import CastleTile from './components/CastleTile';

function App() {
  const [castles, setCastles] = useState({});

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data.json`)
      .then((response) => response.json())
      .then((data) => setCastles(data));
  }, []);

  return (
    <div className="App">
      <ul className="castle-list">
        {Object.keys(castles).map((key) => (
          <li key={key}>
            <CastleTile castle={castles[key as keyof typeof castles]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
