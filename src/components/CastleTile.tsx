import React from 'react';
import Castle from '../Castle';

type Props = {
  castle: Castle;
};

function CastleTile({ castle }: Props) {
  return (
    <div className="castle-tile">
      <h2 className="primary">{castle.name.primary}</h2>
      {castle.name.secondary && (
        <h2 className="secondary">{castle.name.secondary}</h2>
      )}
    </div>
  );
}

export default CastleTile;
