import React from 'react';

type Props = {
  castleCount: number;
};

function Header({ castleCount }: Props) {
  return (
    <header>
      <h1>
        Castle App <span>| A Search Tool for European Castles</span>
      </h1>
      <p>{`${castleCount} castle entries`}</p>
    </header>
  );
}

export default Header;
