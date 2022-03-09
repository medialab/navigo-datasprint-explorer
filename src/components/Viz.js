import React, { useState, useEffect } from 'react';

import ControlBar from './ControlBar';
import Matrix from './Matrix';
import Histogram from './Histogram';
import Graph from './Graph';

import listValues from '../utils/listValues';

export default function Viz ({
    data,
    fields,
    type,
    sourceFilesState
}) {
    /** @type {[Object, Function]} */
    const [year, setYear] = useState(fields?.years[0] || {});
    /** @type {[Object, Function]} */
    const [action, setAction] = useState(fields?.actions[0] || {});
    /** @type {[Object, Function]} */
    const [filters, setFilters] = useState(fields?.filters[0] || {});
    /** @type {[Object, Function]} */
    const [x, setX] = useState(fields?.groups[0] || []);
    /** @type {[Object, Function]} */
    const [y, setY] = useState(fields?.groups[1] || {});
    /** @type {[Object, Function]} */
    const [aggregate, setAggregate] = useState(fields?.aggregation[0] || {});
    /** @type {[Object[], Function]} */
    const [additionalFiltersX, setAdditionalFiltersX] = useState([]);
    /** @type {[Object[], Function]} */
    const [additionalFiltersY, setAdditionalFiltersY] = useState([]);
    /** @type {[Boolean Function]} */
    const [displayNullValues, setDisplayNullValues] = useState(true);
    /** @type {[String[] Function]} */
    const [xValues, setXValues] = useState(() => {
        if (type === 'matrice') {
            return listValues(data, x.field); }

        return [];
    });
    const [yValues, setYValues] = useState(listValues(data, y.field));

    useEffect(() => {
        const newList = listValues(data, x.field);

        if (JSON.stringify(xValues) === JSON.stringify(newList)) {
            return;
        }

        setAdditionalFiltersX([]);
        setXValues(newList);
    }, [x]);

    useEffect(() => {
        const newList = listValues(data, y.field);

        if (JSON.stringify(yValues) === JSON.stringify(newList)) {
            return;
        }

        setAdditionalFiltersY([]);
        setYValues(newList);
    }, [y]);

    return (
        <div className='columns'>
            <ControlBar
                fields={fields}
                data={data}
                type={type}

                xValues={xValues}
                yValues={yValues}

                sourceFilesState={sourceFilesState}
                yearState={[year, setYear]}
                actionState={[action, setAction]}
                filtersState={[filters, setFilters]}
                xState={[x, setX]}
                yState={[y, setY]}
                aggregateState={[aggregate, setAggregate]}
                displayNullValuesState={[displayNullValues, setDisplayNullValues]}
                additionalFiltersXState={[additionalFiltersX, setAdditionalFiltersX]}
                additionalFiltersYState={[additionalFiltersY, setAdditionalFiltersY]}
            />

            {
                type === 'matrice' &&
                <Matrix
                    data={data}

                    year={year}
                    action={action}
                    filters={filters}
                    x={x}
                    y={y}
                    aggregate={aggregate}
                    additionalFiltersX={additionalFiltersX}
                    additionalFiltersY={additionalFiltersY}
                    displayNullValues={displayNullValues}
                />
            }

            {
                type === 'histogramme' &&
                <Histogram
                    data={data}

                    year={year}
                    action={action}
                    filters={filters}
                    y={y}
                    aggregate={aggregate}
                    additionalFiltersX={additionalFiltersX}
                    additionalFiltersY={additionalFiltersY}
                    displayNullValues={displayNullValues}
                />
            }

            {
                type === 'graphe' &&
                <Graph
                    data={data}

                    year={year}
                    action={action}
                    filters={filters}
                    y={y}
                    aggregate={aggregate}
                    additionalFiltersX={additionalFiltersX}
                    additionalFiltersY={additionalFiltersY}
                    displayNullValues={displayNullValues}
                />
            }
        </div>
    );
}