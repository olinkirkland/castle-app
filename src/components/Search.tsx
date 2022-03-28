import { useState } from 'react';
import Drawer from './Drawer';

type Props = {
  applyFilters: Function;
};

function Search({ applyFilters }: Props) {
  const [filters, setFilters] = useState([]);

  return (
    <div className="search">
      <button className="btn" onClick={applyFilters(filters)}>
        Apply Filters
      </button>

      <Drawer
        textOpen="Show Advanced Filters"
        textClose="Hide Advanced Filters"
      >
        <span>Advanced Filters</span>
      </Drawer>
    </div>
  );
}

export default Search;
