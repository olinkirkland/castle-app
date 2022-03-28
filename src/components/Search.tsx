import { useEffect, useState } from 'react';
import { SearchFilter } from '../SearchFilter';
import Checkbox from './Checkbox';
import Drawer from './Drawer';

type Props = {
  applyFilters: Function;
  resultsCount: number;
};

const defaultFilter = {
  name: '',
  primaryNameOnly: false
};

function Search({ applyFilters: applyFilter, resultsCount }: Props) {
  const [filter, setFilter] = useState<SearchFilter>(defaultFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<SearchFilter>(defaultFilter);

  useEffect(() => {
    applyFilter(filter);
  }, []);

  function validateView() {
    // Apply filter to view rather than the other way around
  }

  return (
    <form
      className="search container"
      onSubmit={(event) => {
        event.preventDefault();
        applyFilter(filter);
        setAppliedFilter(filter);
      }}
    >
      <h3>
        <strong>{resultsCount}</strong> results
        {/* in Bavaria, Brandenburg, and North
        Rhine-Westphalia */}
      </h3>
      <div className="filters">
        <input
          className="filter-name"
          type="text"
          placeholder="Castle Name"
          onChange={(event) => {
            setFilter((prev) => {
              return { ...prev, name: event.target.value };
            });
          }}
        />

        <label>
          <Checkbox
            text="Primary Name"
            checked={(b: boolean) => {
              setFilter((prev) => {
                return { ...prev, primaryNameOnly: b };
              });
            }}
          />
        </label>

        {/* <input className="filter-name" type="text" placeholder="Location" /> */}
      </div>

      <Drawer
        textOpen="View JSON filter output"
        textClose="Hide JSON filter output"
      >
        <div className="grid grid-2">
          <pre>{JSON.stringify(filter, null, 2)}</pre>
          <pre>{JSON.stringify(appliedFilter, null, 2)}</pre>
        </div>
      </Drawer>

      {/* <Drawer
        textOpen="Show Advanced Filters"
        textClose="Hide Advanced Filters"
      >
        <span>Advanced Filters</span>
      </Drawer> */}

      <div className="submit-box">
        {/* <button
          className="btn"
          disabled={JSON.stringify(filter) === JSON.stringify(defaultFilter)}
          onClick={() => {
            setFilter(defaultFilter);
            validateView();
          }}
        >
          Reset
        </button> */}
        <input
          className="btn"
          disabled={JSON.stringify(filter) === JSON.stringify(appliedFilter)}
          type="submit"
          value="Apply Filters"
        />
      </div>
    </form>
  );
}

export default Search;
