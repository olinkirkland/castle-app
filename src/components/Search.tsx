import { useEffect, useState } from 'react';
import { SearchFilter } from '../SearchFilter';
import Translatable from '../Translatable';
import Checkbox from './Checkbox';
import Drawer from './Drawer';

type Props = {
  applyFilter: Function;
  resultsCount: number;
};

let defaultFilter: SearchFilter = {
  name: '',
  includeSecondaryName: false,
  mustHaveImages: false,
  id: '',
  dateFrom: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  dateTo: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  classifications: [],
  purposes: [],
  structures: []
};

function Search({ applyFilter, resultsCount }: Props) {
  const [filter, setFilter] = useState<SearchFilter>(defaultFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<SearchFilter>(defaultFilter);

  const [geography, setGeography] = useState({ nodes: [] });
  const [classifications, setClassifications] = useState<Translatable[]>();
  const [structures, setStructures] = useState<Translatable[]>();
  const [purposes, setPurposes] = useState<Translatable[]>();

  useEffect(() => {
    applyFilter(filter);
    fetch(`${process.env.PUBLIC_URL}/filter-data.json`)
      .then((response) => response.json())
      .then((data) => {
        setGeography(data.geography);
        setClassifications(data.classifications);
        setStructures(data.structures);
        setPurposes(data.purposes);
      });
  }, []);

  useEffect(() => {
    if (!classifications) return;
    setFilter((prev) => {
      return { ...prev, classifications: [...classifications] };
    });

    defaultFilter = {
      ...defaultFilter,
      classifications: [...classifications]
    };
  }, [classifications]);

  function toggleSelectAllClassifications() {
    if (filter.classifications.length === classifications!.length) {
      console.log('select none');
      // Select none
      setFilter((prev) => {
        return { ...prev, classifications: [] };
      });
    } else {
      // Select all
      console.log('select all');
      setFilter((prev) => {
        return { ...prev, classifications: [...classifications!] };
      });
    }
  }

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
        <div className="inputWithCheckbox">
          <input
            className="filter-long"
            type="text"
            placeholder="Castle Name"
            value={filter.name}
            onChange={(event) => {
              setFilter((prev) => {
                return { ...prev, name: event.target.value };
              });
            }}
          />
          <Checkbox
            text="Include suffix"
            value={filter.includeSecondaryName}
            checked={(b: boolean) => {
              setFilter((prev) => {
                return { ...prev, includeSecondaryName: b };
              });
            }}
          />
        </div>
        {/* {geography && geography.nodes.map((g) => <p>{g['name']}</p>)} */}
      </div>
      {classifications && (
        <Drawer
          textOpen={`Show Classifications (${filter.classifications.length})`}
          textClose={`Hide Classifications (${filter.classifications.length})`}
        >
          <>
            <div className="filters">
              {classifications.map((c, index) => (
                <Checkbox
                  key={index}
                  text={c.en ? c.en : c.de}
                  value={
                    filter.classifications.find((f) => c.de === f.de) !==
                    undefined
                  }
                  capitalize={true}
                  checked={(b: boolean) => {
                    let arr = [...filter.classifications];
                    if (b) {
                      const i: number = arr.findIndex((f) => f.de === c.de);
                      if (i === -1) arr.push(c);
                    } else {
                      const i: number = arr.findIndex((f) => f.de === c.de);
                      if (i !== -1) arr.splice(i, 1);
                    }

                    setFilter((prev) => {
                      return {
                        ...prev,
                        classifications: arr
                      };
                    });
                  }}
                ></Checkbox>
              ))}
            </div>
            <div className="filters">
              <button className="btn" onClick={toggleSelectAllClassifications}>
                {filter.classifications.length === classifications.length
                  ? 'Select None'
                  : 'Select All'}
              </button>
            </div>
          </>
        </Drawer>
      )}
      <div className="filters">
        <Checkbox
          text="Image gallery"
          value={filter.mustHaveImages}
          checked={(b: boolean) => {
            setFilter((prev) => {
              return { ...prev, mustHaveImages: b };
            });
          }}
        />
        {}
      </div>

      <Drawer
        textOpen="View JSON filter output"
        textClose="Hide JSON filter output"
      >
        <pre>{JSON.stringify(filter, null, 2)}</pre>
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
