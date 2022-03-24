import React from 'react';
import Castle, { GalleryImage, HistoryDate } from '../Castle';
import Util from '../Util';
import Drawer from './Drawer';

type Props = {
  castle?: Castle;
};

export default function CastleDetails({ castle }: Props) {
  function onClickJson() {
    console.log(JSON.stringify(castle));
  }

  function formatDate(date: HistoryDate, end: boolean = false): string {
    let str = end ? 'Present day' : 'Unknown';
    if (!date) return str;

    if (date.century) {
      str = Util.numberToAdj(date.century) + ' century';
      if (date.half)
        str = `${date.half === 1 ? 'First' : 'Second'} half of the ${str}`;
    }

    return str;
  }

  function enlargeGalleryImage(g: GalleryImage) {
    console.log(g.url);
  }

  if (!castle) {
    return <>No castle selected</>;
  }

  return (
    <div className="details">
      <div className="info">
        <h1>{castle.name.primary}</h1>
        {castle.name.secondary && castle.name.secondary.length > 0 && (
          <h2>{castle.name.secondary}</h2>
        )}
      </div>

      <div className="info">
        <div className="info-header">
          <i className="fa-solid fa-location-dot"></i>
          <h2>Location</h2>
        </div>
        <div className="location">
          <div>
            {castle.location.city && <p>{`${castle.location.city}`}</p>}
            {castle.location.county && (
              <p className="muted">{`${castle.location.county}`}</p>
            )}
          </div>
          <div className="with-crest">
            <img
              src={`${process.env.PUBLIC_URL}/images/countries/${castle.location.country.abbreviation}/states/${castle.location.state.abbreviation}_crest.svg`}
              alt=""
            />
            <div>
              {castle.location.region && <p>{`${castle.location.region}`}</p>}
              <p>{castle.location.state.en}</p>
            </div>
          </div>
          <div>
            <span>
              <img
                className="flag-sm"
                src={`${process.env.PUBLIC_URL}/images/countries/${castle.location.country.abbreviation}/${castle.location.country.abbreviation}.svg`}
                alt=""
              />
              {castle.location.country.en}
            </span>
            <p className="muted">{castle.location.subregion.en}</p>
          </div>
        </div>
        <Drawer textOpen="Show JSON" textClose="Hide JSON">
          <pre>{JSON.stringify(castle.location, null, 2)}</pre>
        </Drawer>
      </div>

      {castle.condition && (
        <div className="info">
          <div className="info-header">
            <i className="fa-solid fa-archway"></i>
            <h2>Condition</h2>
          </div>
          <p className="capitalize">{castle.condition.en}</p>
          <Drawer
            textOpen="Show Condition Notes"
            textClose="Hide Condition Notes"
          >
            <>
              {castle.conditionCommentary &&
                castle.conditionCommentary.length > 0 && (
                  <p>{castle.conditionCommentary}</p>
                )}
              {(!castle.conditionCommentary ||
                castle.conditionCommentary.length === 0) && (
                <p className="muted">No commentary provided</p>
              )}
            </>
          </Drawer>
        </div>
      )}

      <div className="info">
        <div className="info-header">
          <i className="fa-solid fa-calendar-day"></i>
          <h2>Dating</h2>
        </div>
        {formatDate(castle.dates.start)} - {formatDate(castle.dates.end, true)}
        <Drawer textOpen="Show JSON" textClose="Hide JSON">
          <pre>{JSON.stringify(castle.dates, null, 2)}</pre>
        </Drawer>
      </div>

      {castle.purpose && (
        <div className="info">
          <p className="title">Purpose</p>
          <pre>{JSON.stringify(castle.purpose, null, 2)}</pre>
        </div>
      )}

      {castle.classifications && (
        <div className="info">
          <p className="title">Classification</p>
          <pre>{JSON.stringify(castle.classifications, null, 2)}</pre>
        </div>
      )}

      {castle.structures && (
        <div className="info">
          <p className="title">Structure</p>
          <pre>{JSON.stringify(castle.structures, null, 2)}</pre>
        </div>
      )}

      {castle.gallery.length > 0 && (
        <div className="info">
          <div className="info-header">
            <i className="fa-solid fa-images"></i>
            <h2>Gallery ({castle.gallery.length})</h2>
          </div>
          <ul className="gallery">
            {castle.gallery.map((g, index) => (
              <li
                className="gallery-item"
                key={index}
                onClick={() => {
                  enlargeGalleryImage(g);
                }}
              >
                <img src={process.env.PUBLIC_URL + g.path} alt="" />
                <div className="gallery-item-overlay">
                  <i className="fa-solid fa-image"></i>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="info">
        <div className="info-header">
          <i className="fa-solid fa-book"></i>
          <h2>Miscellaneous</h2>
        </div>
        <ul className="badge-group">
          <li>{castle.id}</li>
          <li>{castle.slug}</li>
        </ul>
      </div>

      <div className="details-footer">
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
