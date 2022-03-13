import React from 'react';
import { Castle } from '../Castle';

type Props = {
  castle: Castle;
};

function CastleTile({ castle }: Props) {
  return (
    <div className="castle-tile">
      <h2>{castle.title}</h2>
      <ul className="gallery">
        {castle.gallery.map((g) => (
          <li className="gallery-item" key={g.url}>
            <img src={`http://ebidat.de${g.url}`} alt="" />
            <a href={`http://ebidat.de${g.url}`} target="_blank">
              {g.caption}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CastleTile;
