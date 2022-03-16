import React from 'react';
import { Castle, Gallery } from '../Castle';

type Props = {
  castle: Castle;
};

function CastleTile({ castle }: Props) {
  function onClickJson() {
    // Todo route subdomain in new window
    navigator.clipboard.writeText(JSON.stringify(castle));
  }

  function onClickGalleryItem(g: any) {
    console.log(JSON.stringify(g, null, '  '));
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

        {castle.dateBegin && castle.dateEnd && (
          <div className="info">
            <p className="title">Dating</p>
            <p>{`${castle.dateBegin} - ${castle.dateEnd}`}</p>
          </div>
        )}

        {castle.structureType && (
          <div className="info">
            <p className="title">Structure</p>

            <p>{castle.structureType.join(', ')}</p>
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
          <p className="title">
            <i className="fa-solid fa-images"></i>Gallery ({castle.gallery.length})
          </p>
          <ul className="gallery">
            {castle.gallery.map((g, index) => (
              <li className="gallery-item" key={index}>
                <a onClick={() => onClickGalleryItem(g)} target="_blank">
                  <img src={process.env.PUBLIC_URL + g.path} alt="" />
                  <div className="gallery-item-overlay">
                    <i className="fa-solid fa-image"></i>
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
