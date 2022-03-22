import React from 'react';
import Castle from '../Castle';
import CastleTile from './CastleTile';

type Props = {
  castles?: Castle[];
  setSelectedCastle: Function;
};

export default function CastleList({ castles, setSelectedCastle }: Props) {
  if (!castles) return <></>;

  return (
    <ul className="castle-list">
      {castles.map((c) => (
        <li
          key={c.id}
          onClick={() => {
            setSelectedCastle(c);
          }}
        >
          <CastleTile castle={c} />
        </li>
      ))}
    </ul>
  );
}
