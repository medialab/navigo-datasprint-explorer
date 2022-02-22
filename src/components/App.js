import React, { useState, useEffect } from 'react';
import { get } from 'axios';
import { csvParse } from 'd3-dsv';

import Header from './Header';
import ControlBar from './ControlBar';
import Matrix from './Matrix';

import fields from '../navigo-pointcalls-fields.json'

export default function App({

}) {
    const [data, setData] = useState(null);
    /**
     * @param {'loading'|'failed'|'success'}
     */
    const [loadingState, setLoadingState] = useState('loading');

    const [year, setYear] = useState(
        `{ "filter": { "field": "year", "equal": "${fields.years[0].value}" } }`
    );
    const [action, setAction] = useState(
        `{ "filter": { "field": "pointcall_action", "equal": "${fields.actions[0].value}" } }`
    );
    const [filter, setFilter] = useState(
        `{"filter": { "field": "${fields.filters[0].field}", "equal": "${fields.filters[0].value}" } }`
    );
    const [x, setX] = useState(
        `{ "field": "${fields.groups[0].field}", "type": "nominal", "axis": { "orient": "top" }, "title": "${fields.groups[0].label}" }`
    );
    const [y, setY] = useState(
        `{ "field": "${fields.groups[1].field}", "type": "nominal", "sort": "-color", "title": "${fields.groups[1].label}" }`
    );
    const [aggregate, setAggregate] = useState(
        `{"aggregate": "${fields.aggregation[0].aggregate}", "field": "${fields.aggregation[0].field}", "title": "${fields.aggregation[0].label}"}`
    );
    const [displayNullValues, setDisplayNullValues] = useState(true);

    useEffect(() => {
        get(process.env.BASE_PATH + 'data/matrix-pointcalls.csv')
            .then(({ data: str }) => {
                try {
                    const csv = csvParse(str);
                    setData(csv);
                    setLoadingState('success');
                } catch (error) {
                    console.error(error);
                    setLoadingState('failed');
                }
            })
            .catch((error) => {
                console.error(error);
                setLoadingState('failed');
            })
    }, [])

    useEffect(() => {
        console.log(displayNullValues);
    })

    if (loadingState === 'loading') {
        return <div>Chargement en cours</div>
    }

    if (loadingState === 'failed') {
        return <div>Erreur de chargement</div>
    }

    return (
        <div>
            <Header />

            <main className='columns'>
                <ControlBar
                    control={{
                        year: [year, setYear],
                        action: [action, setAction],
                        filter: [filter, setFilter],
                        x: [x, setX],
                        y: [y, setY],
                        aggregate: [aggregate, setAggregate],
                        displayNullValues: [displayNullValues, setDisplayNullValues]
                    }}
                />

                <Matrix
                    data={data}
                    control={{
                        year: year,
                        action: action,
                        filter: filter,
                        x: x,
                        y: y,
                        aggregate: aggregate,
                        displayNullValues: displayNullValues
                    }}
                />
            </main>
        </div>
    );
}