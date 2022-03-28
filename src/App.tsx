import React, { useEffect, useState } from 'react';
import './assets/css/queries.css';
import './assets/css/styles.css';
import Castle from './Castle';
import CastleDetails from './components/CastleDetails';
import CastleList from './components/CastleList';
import Footer from './components/Footer';
import Header from './components/Header';
import Search from './components/Search';
import { SearchFilter } from './SearchFilter';

function App() {
  const [allCastles, setAllCastles] = useState<Castle[]>([]);
  const [castles, setCastles] = useState<Castle[]>([]);
  const [selectedCastle, setSelectedCastle] = useState();
  const [filter, setFilter] = useState<SearchFilter>();

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/analysis.json`)
      .then((response) => response.json())
      .then((data) => {
        const arr: Castle[] = Object.keys(data).map(
          (key) => data[key as keyof typeof castles]
        );

        setAllCastles(arr);
      });
  }, []);

  useEffect(() => {
    if (!filter) return;
    // Apply filter
    let results = allCastles.filter((c) => {
      let b = true;

      if (filter.name.length > 0)
        if (!matchesName(c, filter.name, filter.primaryNameOnly)) b = false;

      if (filter.mustHaveImages)
        if (!c.gallery || c.gallery.length === 0) b = false;

      if (filter.id.length > 0) if (c.id !== filter.id) b = false;
      return b;
    });

    setCastles(results);
  }, [allCastles, filter]);

  function matchesName(c: Castle, text: string, primaryOnly: boolean): boolean {
    let str: string = c.name.primary;
    if (!primaryOnly && c.name.secondary) str += c.name.secondary;
    return str.toLowerCase().includes(text.toLowerCase());
  }

  function applyFilter(f: SearchFilter) {
    setFilter(f);
  }

  return (
    <div className="main">
      <Header />

      <Search applyFilter={applyFilter} resultsCount={castles.length} />

      <article className="container">
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
