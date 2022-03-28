import { useState } from 'react';
import Drawer from './Drawer';

type Props = {
  applyFilters: Function;
};

function Search({ applyFilters }: Props) {
  const [filters, setFilters] = useState([]);

  return (
    <form
      className="search container"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters(filters);
      }}
    >
      <h3><strong>37</strong> Results in Bavaria, Brandenburg, and Northrhine-Westphalia</h3>
      <div className="filters">
        <input className="filter-name" type="text" placeholder="Castle Name" />
        <input className="filter-name" type="text" placeholder="Castle Name" />
      </div>

      {/* <Drawer
        textOpen="Show Advanced Filters"
        textClose="Hide Advanced Filters"
      >
        <span>Advanced Filters</span>
      </Drawer> */}

      <div className="submit-box">
        <input className="btn" type="submit" value="Apply Filters" />
      </div>
    </form>
  );
}

export default Search;
