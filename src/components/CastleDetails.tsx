import React, { useEffect, useState } from 'react';
import Castle, { GalleryImage, HistoryDate } from '../Castle';
import Util from '../Util';
import Drawer from './Drawer';

type Props = {
  castle?: Castle;
};

export default function CastleDetails({ castle }: Props) {
  const [spotlight, setSpotlight] = useState<GalleryImage | undefined>();

  useEffect(() => {
    if (!castle) return;
    if (castle.gallery && castle.gallery.length > 0) {
      setSpotlight(castle.gallery[0]);
    } else {
      setSpotlight(undefined);
    }
  }, [castle]);

  function onClickJson() {
    Util.download(`${castle!.slug}.json`, JSON.stringify(castle, null, 2));
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
      </div>

      <div className="info">
        <div className="info-header">
          <i className="fa-solid fa-calendar-day"></i>
          <h2>Dating and Condition</h2>
        </div>
        {formatDate(castle.dates.start)} - {formatDate(castle.dates.end, true)}
        <em>
          {Util.capitalize(
            castle.condition.en ? castle.condition.en : castle.condition.de
          )}
        </em>
        {castle.condition && (
          <Drawer textOpen="Show more" textClose="Show less">
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
        )}
      </div>

      <div className="info">
        <div className="info-header">
          <i className="fa-solid fa-book"></i>
          <h2 className="title">Classification and Purpose</h2>
        </div>
        {castle.structures && (
          <ul className="badge-group">
            {castle.structures.map((t, index) => {
              if (castle.structures.length > 1 && t.en === 'other')
                return <></>;

              return (
                <li
                  key={index}
                  className={`capitalize ${!t.en && 'muted'}`}
                >{`${t.en ? t.en : t.de}`}</li>
              );
            })}
          </ul>
        )}
        {castle.classifications && castle.classifications.length > 0 && (
          <ul className="badge-group">
            {castle.classifications.map((t, index) => (
              <li key={index} className={`capitalize ${!t.en && 'muted'}`}>{`${
                t.en ? t.en : t.de
              }`}</li>
            ))}
          </ul>
        )}

        {castle.purpose && (
          <ul className="badge-group">
            {castle.purpose.map((t, index) => (
              <li key={index} className={`capitalize ${!t.en && 'muted'}`}>{`${
                t.en ? t.en : t.de
              }`}</li>
            ))}
          </ul>
        )}
      </div>

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
                  setSpotlight(g);
                }}
              >
                <img src={process.env.PUBLIC_URL + g.path} alt="" />
                <div className="gallery-item-overlay">
                  <i className="fa-solid fa-image"></i>
                </div>
              </li>
            ))}
          </ul>
          {spotlight && (
            <div className="spotlight">
              <img src={`${process.env.PUBLIC_URL}${spotlight.path}`} alt="" />
              <p>{spotlight.caption}</p>
            </div>
          )}
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
          <span>Download JSON</span>
        </button>

        <a
          className="btn"
          href={castle.urls[0]}
          target="_blank"
          rel="noreferrer"
        >
          <span>EBIDAT Reference</span>
          <i className="fa-solid fa-up-right-from-square"></i>
        </a>
      </div>
    </div>
  );
}
