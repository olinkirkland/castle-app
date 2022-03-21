import React from 'react';
import { Castle } from '../Castle';

type Props = {
  castle?: Castle;
};

export default function CastleDetails({ castle }: Props) {
  function onClickJson() {
    console.log(JSON.stringify(castle));
  }

  if (!castle) {
    return <>No castle selected</>;
  }

  return (
    <div className="details">
      <div className="location">
        <i className="fa-solid fa-location-dot"></i>
        <div>
          <p>
            <span>{castle.location.city && `${castle.location.city},`}</span>
            <span>{!castle.location.city && `${castle.location.county},`}</span>
            <span>{`${castle.location.state.en}`}</span>
          </p>
          <img
            className="flag-sm"
            src={`${process.env.PUBLIC_URL}/flags/countries/${castle.location.country.abbreviation}/states/${castle.location.state.abbreviation}.svg`}
            alt=""
          />
        </div>
      </div>

      {castle.condition && (
        <div className="info">
          <p className="title">Condition</p>
          <p>{castle.condition.en}</p>
        </div>
      )}

      {/* {castle.dateBegin && castle.dateEnd && (
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

      {castle.gallery.length > 0 && castle.gallery.length > 0 && (
        <div className="info full">
          <p className="title">
            <i className="fa-solid fa-images"></i>Gallery (
            {castle.gallery.length})
          </p>
          <ul className="gallery">
            {castle.gallery.map((g, index) => (
              <li className="gallery-item" key={index}>
                <img src={process.env.PUBLIC_URL + g.path} alt="" />
                <div className="gallery-item-overlay">
                  <i className="fa-solid fa-image"></i>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="button-bar">
        <button className="btn" onClick={onClickJson}>
          <span>Json data</span>
        </button>

        <a
          className="btn"
          href={castle.urls[0]}
          target="_blank"
          rel="noreferrer"
        >
          <span>Source</span>
        </a>
      </div>
    </div>
  );
}
