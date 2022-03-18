import React from 'react';
import { Castle } from '../Castle';

type Props = {
  castle: Castle;
  openModal: Function;
};

function CastleTile({ castle, openModal }: Props) {
  function onClickJson() {
    // Todo route subdomain in new window
    navigator.clipboard.writeText(JSON.stringify(castle));
  }

  function onClickGalleryItem(g: any) {
    openModal(castle.name.primary, g);
  }

  return (
    <div className="castle-tile">
      <div className="castle-tile-header">
        <h2 className="primary">{castle.name.primary}</h2>
        {castle.name.secondary && (
          <h2 className="secondary">{castle.name.secondary}</h2>
        )}
      </div>

      <div className="location">
        <i className="fa-solid fa-location-dot"></i>
        <div>
          <p>{`${castle.location.city}, ${castle.location.county}`}</p>

          <p>
            {castle.location.region && (
              <span>{`${castle.location.region}, `}</span>
            )}
            <span>{`${castle.location.state.en}`}</span>
            <span className="country-code">{`${castle.location.country.abbreviation!.toUpperCase()}`}</span>
          </p>
        </div>
      </div>

      {/* {castle.condition && (
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
        )} */}
      {/* </div> */}

      {/* {false && castle.gallery.length > 0 && (
        <div className="info full">
          <p className="title">
            <i className="fa-solid fa-images"></i>Gallery (
            {castle.gallery.length})
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
      )} */}

      {/* <div className="castle-tile-footer">
        <a className="btn" onClick={onClickJson}>
          <span>Json data</span>
        </a>
        <a className="btn" href={castle.urls[0]} target="_blank">
          <span>Source</span>
        </a>
      </div> */}
    </div>
  );
}

export default CastleTile;
