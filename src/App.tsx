import React, { useEffect, useState } from 'react';
import './assets/css/styles.css';
import './assets/css/queries.css';
import CastleTile from './components/CastleTile';
import Modal from './components/Modal';

function App() {
  const [castles, setCastles] = useState({});
  const [galleryItem, setGalleryItem] = useState();

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data.json`)
      .then((response) => response.json())
      .then((data) => setCastles(data));
  }, []);

  function openModal(title: string, galleryItem: any) {
    // console.log(JSON.stringify(galleryItem, null, '  '));
    setGalleryItem(galleryItem);

    // Lock scroll
    document.querySelector('body')!.classList.add('scroll-lock');
  }

  function closeModal() {
    setGalleryItem(undefined);

    // Unlock scroll
    document.querySelector('body')!.classList.remove('scroll-lock');
  }

  return (
    <div className="main">
      <section>
        <ul className="castle-list">
          {Object.keys(castles).map((key) => (
            <li key={key}>
              <CastleTile
                castle={castles[key as keyof typeof castles]}
                openModal={openModal}
              />
            </li>
          ))}
        </ul>
      </section>
      {galleryItem && (
        <Modal
          title={castles[galleryItem['castle']]['title']}
          closeModal={closeModal}
        >
          <img src={process.env.PUBLIC_URL + galleryItem['path']} alt="" />
          <div className="modal-info">
            <p>{galleryItem['caption']}</p>
            <p>{galleryItem['year']}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
