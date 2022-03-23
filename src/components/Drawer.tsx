import { useState } from 'react';

type Props = {
  textOpen: string;
  textClose: string;
  children: JSX.Element;
};

export default function Drawer({ textOpen, textClose, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function onToggle(event: React.MouseEvent) {
    setIsOpen((prev: Boolean) => !prev);
  }

  return (
    <div className="drawer">
      {isOpen && <div className="drawer-body">{children}</div>}
      <button
        className="btn"
        onClick={(event) => {
          onToggle(event);
        }}
      >
        {isOpen ? textClose : textOpen}
      </button>
    </div>
  );
}
