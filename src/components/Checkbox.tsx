import { useEffect, useState } from 'react';

type Props = {
  text?: String;
  checked: Function;
};

export default function Checkbox({ text, checked }: Props) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    checked(isChecked);
  }, [isChecked]);

  function onToggle(event: React.MouseEvent) {
    setIsChecked((prev: Boolean) => !prev);
  }

  return (
    <div className="checkbox" onClick={onToggle}>
      <span className="icon-frame">
        {isChecked && <i className="fa-solid fa-check"></i>}
      </span>
      <p>{text}</p>
    </div>
  );
}
