import { useState } from 'react';
import Drawer from './Drawer';

type Props = {
  applyFilters: Function;
};

function Search({ applyFilters }: Props) {
  const [filters, setFilters] = useState([]);

  return (
    <form
      className="search"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilters(filters);
      }}
    >
      <Drawer
        textOpen="Show Advanced Filters"
        textClose="Hide Advanced Filters"
      >
        <span>Advanced Filters</span>
      </Drawer>

      <input className="btn" type="submit" value="Apply Filters" />
    </form>
  );
}

export default Search;
