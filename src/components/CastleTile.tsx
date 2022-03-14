import React from 'react';
import { Castle } from '../Castle';

type Props = {
  castle: Castle;
};

function CastleTile({ castle }: Props) {
  return (
    <div className="castle-tile">
      <h2>{castle.title}</h2>
      <p>{castle.condition}</p>
      <p>{castle.city}</p>
      <ul className="gallery">
        {castle.gallery.map((g) => (
          <li className="gallery-item" key={g.url}>
            <img src={`https://ebidat.de${g.url}`} alt="" />
            <div className="gallery-item-overlay">
              <i className="fas fa-external-link-alt"></i>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CastleTile;
