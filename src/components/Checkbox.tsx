import { useEffect, useState } from 'react';

type Props = {
  text?: String;
  value: boolean;
  capitalize?: boolean;
  checked: Function;
  untranslated?: boolean;
};

export default function Checkbox({
  text,
  value = false,
  checked,
  capitalize = false,
  untranslated = false
}: Props) {
  const [isChecked, setIsChecked] = useState(value);

  useEffect(() => {
    checked(isChecked);
  }, [isChecked]);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  function onToggle(event: React.MouseEvent) {
    setIsChecked((prev: Boolean) => !prev);
  }

  return (
    <div className="checkbox" onClick={onToggle}>
      <span className="icon-frame">
        {isChecked && <i className="fa-solid fa-check"></i>}
      </span>
      {untranslated && <div className="country-badge">de</div>}
      <p className={`noselect ${capitalize ? 'capitalize' : ''}`}>{text}</p>
    </div>
  );
}
