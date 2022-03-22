import React, { useEffect, useState } from 'react';
import './assets/css/queries.css';
import './assets/css/styles.css';
import Castle from './Castle';
import CastleDetails from './components/CastleDetails';
import CastleList from './components/CastleList';
import Footer from './components/Footer';
import Header from './components/Header';
import Search from './components/Search';

function App() {
  const [castles, setCastles] = useState<Castle[]>([]);
  const [selectedCastle, setSelectedCastle] = useState();

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/analysis.json`)
      .then((response) => response.json())
      .then((data) => {
        const arr: Castle[] = Object.keys(data).map(
          (key) => data[key as keyof typeof castles]
        );

        setCastles(arr);
      });
  }, []);

  function applyFilters() {
    console.log('apply filters');
  }

  return (
    <div className="main">
      <Header />

      <Search applyFilter={applyFilters} />

      <article>
        <section id="list">
          <CastleList castles={castles} setSelectedCastle={setSelectedCastle} />
        </section>
        <section id="details">
          <CastleDetails castle={selectedCastle} />
        </section>
      </article>
      <Footer />
    </div>
  );
}

export default App;
