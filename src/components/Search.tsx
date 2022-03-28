import { useState } from 'react';
import Drawer from './Drawer';

type Props = {
  applyFilters: Function;
};

function Search({ applyFilters }: Props) {
  const [filters, setFilters] = useState({ name: '' });
  const [appliedFilters, setAppliedFilters] = useState({ name: '' });

  return (
    <form
      className="search container"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters(filters);
        setAppliedFilters(filters);
      }}
    >
      <h3>
        <strong>37</strong> Results in Bavaria, Brandenburg, and
        Northrhine-Westphalia
      </h3>
      <div className="filters">
        <input
          className="filter-name"
          type="text"
          placeholder="Castle Name"
          onChange={(event) => {
            setFilters((prev) => {
              return { ...prev, name: event.target.value };
            });
          }}
        />
        {/* <input className="filter-name" type="text" placeholder="Location" /> */}
      </div>
      <div className="grid grid-2">
        <pre>{JSON.stringify(filters, null, 2)}</pre>
        <pre>{JSON.stringify(appliedFilters, null, 2)}</pre>
      </div>

      {/* <Drawer
        textOpen="Show Advanced Filters"
        textClose="Hide Advanced Filters"
      >
        <span>Advanced Filters</span>
      </Drawer> */}

      <div className="submit-box">
        <input
          className="btn"
          disabled={JSON.stringify(filters) === JSON.stringify(appliedFilters)}
          type="submit"
          value="Apply Filters"
        />
      </div>
    </form>
  );
}

export default Search;
