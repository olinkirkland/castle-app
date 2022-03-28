import { useEffect, useState } from 'react';
import { SearchFilter } from '../SearchFilter';
import Checkbox from './Checkbox';
import Drawer from './Drawer';

type Props = {
  applyFilter: Function;
  resultsCount: number;
};

const defaultFilter: SearchFilter = {
  name: '',
  primaryNameOnly: false,
  mustHaveImages: false,
  id: ''
};

function Search({ applyFilter, resultsCount }: Props) {
  const [filter, setFilter] = useState<SearchFilter>(defaultFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<SearchFilter>(defaultFilter);

  useEffect(() => {
    applyFilter(filter);
  }, []);

  function submit() {
    applyFilter(filter);
    setAppliedFilter(filter);
  }

  return (
    <div className="search container">
      <h3>
        <strong>{resultsCount}</strong> results
        {/* in Bavaria, Brandenburg, and North
        Rhine-Westphalia */}
      </h3>
      <div className="filters">
        <input
          className="filter-short"
          type="text"
          placeholder="Id"
          value={filter.id}
          onChange={(event) => {
            setFilter((prev) => {
              return { ...prev, id: event.target.value };
            });
          }}
        />
        <input
          className="filter-full"
          type="text"
          placeholder="Castle Name"
          value={filter.name}
          onChange={(event) => {
            setFilter((prev) => {
              return { ...prev, name: event.target.value };
            });
          }}
        />
      </div>
      <div className="filters">
        <Checkbox
          text="Primary name only"
          value={filter.primaryNameOnly}
          checked={(b: boolean) => {
            setFilter((prev) => {
              return { ...prev, primaryNameOnly: b };
            });
          }}
        />
        <Checkbox
          text="Must contain images"
          value={filter.mustHaveImages}
          checked={(b: boolean) => {
            setFilter((prev) => {
              return { ...prev, mustHaveImages: b };
            });
          }}
        />
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
        <button
          className="btn"
          disabled={JSON.stringify(filter) === JSON.stringify(defaultFilter)}
          onClick={() => {
            setFilter(defaultFilter);
          }}
        >
          Reset
        </button>

        <button
          onClick={submit}
          className="btn"
          disabled={JSON.stringify(filter) === JSON.stringify(appliedFilter)}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default Search;
