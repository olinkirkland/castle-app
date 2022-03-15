import React from 'react';
import { Castle } from '../Castle';

type Props = {
  castle: Castle;
};

function CastleTile({ castle }: Props) {
  function onClickJson() {
    // Todo route subdomain in new window
    console.log(castle);
  }

  return (
    <div className="castle-tile">
      <h2>{castle.title}</h2>

      <div className="wrap">
        <div className="info">
          <p className="title">
            <i className="fa-solid fa-location-dot"></i>
            Location
          </p>
          <p>{`${castle.city}, ${castle.county}`}</p>
        </div>

        {castle.condition && (
          <div className="info">
            <p className="title">Condition</p>
            <p>{castle.condition}</p>
          </div>
        )}

        {castle.classification && (
          <div className="info">
            <p className="title">Classification</p>

            <p>{castle.classification.join(', ')}</p>
          </div>
        )}
      </div>

      {castle.gallery.length > 0 && (
        <div className="info">
          <p className="title">Gallery ({castle.gallery.length})</p>
          <ul className="gallery">
            {castle.gallery.map((g) => (
              <li className="gallery-item" key={g.url}>
                <a href={`https://ebidat.de${g.url}`} target="_blank">
                  <img src={``} alt="" />
                  <div className="gallery-item-overlay">
                    <i className="fas fa-external-link-alt"></i>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="castle-tile-footer">
        <a className="btn" onClick={onClickJson}>
          <span>Json data</span>
        </a>
        <a className="btn" href={castle.urls[0]} target="_blank">
          <span>Source</span>
        </a>
      </div>
    </div>
  );
}

export default CastleTile;
