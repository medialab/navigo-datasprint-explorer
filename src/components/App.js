import React, { useState, useEffect } from 'react';
import { get } from 'axios';
import { csvParse } from 'd3-dsv';

import Header from './Header';
import ControlBar from './ControlBar';
import Matrix from './Matrix';
import Histogram from './Histogram';

export default function App({

}) {
    const [data, setData] = useState(null);
    const [fields, setFields] = useState(null);
    /**
     * @param {'loading'|'failed'|'success'}
     */
    const [loadingState, setLoadingState] = useState('loading');
    /**
     * @param {'matrice'|'histogramme'}
     */
    const [viz, setViz] = useState('matrice');
    /**
     * @param {'pointcalls'|'flows'}
     */
    const [source, setSource] = useState({ label: 'pointcalls', pathData: 'matrix-pointcalls.csv', pathFields: 'navigo-pointcalls-fields.json' });

    const [year, setYear] = useState(null);
    const [action, setAction] = useState(null);
    const [filter, setFilter] = useState(null);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
    const [aggregate, setAggregate] = useState(null);
    const [displayNullValues, setDisplayNullValues] = useState(true);
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [xValues, setXValues] = useState([]);
    const [yValues, setYValues] = useState([]);

    function getData (path) {
        return new Promise((success, failure) => {
            get(process.env.BASE_PATH + 'data/' + path)
            .then(({ data: str }) => {
                try {
                    const csv = csvParse(str);
                    success(csv);
                } catch (error) {
                    failure(error);
                }
            })
            .catch((error) => {
                failure(error);
            })
        })
    }

    function getField (path) {
        return new Promise((success, failure) => {
            get(process.env.BASE_PATH + 'data/' + path)
            .then(({ data: json }) => {
                try {
                    success(json);
                } catch (error) {
                    failure(error);
                }
            })
            .catch((error) => {
                failure(error);
            })
        })
    }

    useEffect(() => {
        const { pathData, pathFields } = source;
        console.info('load data');

        Promise.all([getData(pathData), getField(pathFields)])
            .then(([data, fields]) => {
                setData(data);

                console.log(fields);
                setFields(fields)
                setYear(`{ "filter": { "field": "${fields.years[0].field}", "equal": "${fields.years[0].value}" } }`)
                setAction(`{ "filter": { "field": "${fields.actions[0].field}", "equal": "${fields.actions[0].value}" } }`)
                setFilter(`{"filter": { "field": "${fields.filters[0].field}", "equal": "${fields.filters[0].value}" } }`)
                setX(`{ "field": "${fields.groups[0].field}", "type": "nominal", "axis": { "orient": "top" }, "title": "${fields.groups[0].label}" }`)
                setY(`{ "field": "${fields.groups[1].field}", "type": "nominal", "sort": "-color", "title": "${fields.groups[1].label}" }`)
                setAggregate(`{"aggregate": "${fields.aggregation[0].aggregate}", "field": "${fields.aggregation[0].field}", "title": "${fields.aggregation[0].label}"}`)

                setLoadingState('success');
            })
            .catch((error) => {
                console.error(error);
                setLoadingState('failed');
            })
    }, [source]);

    useEffect(() => {
        if (loadingState !== 'success') { return; }

        let field;

        try {
            const result = JSON.parse(x);
            field = result.field;
        } catch (error) {
            console.error(error);
            setXValues([])
        }
        
        let list = new Set();

        for (let i = 0; i < data.length; i++) {
            const value = data[i][field];
            if (value === '') { continue; }
            list.add(value);
        }

        setXValues(Array.from(list).sort())
    }, [x, loadingState]);

    useEffect(() => {
        if (loadingState !== 'success') { return; }

        let field;

        try {
            const result = JSON.parse(y);
            field = result.field;
        } catch (error) {
            console.error(error);
            setYValues([])
        }
        
        let list = new Set();

        for (let i = 0; i < data.length; i++) {
            const value = data[i][field];
            if (value === '') { continue; }
            list.add(value);
        }

        setYValues(Array.from(list).sort())
    }, [y, loadingState]);

    if (loadingState === 'loading') {
        return <div>Chargement en cours</div>
    }

    if (loadingState === 'failed') {
        return <div>Erreur de chargement</div>
    }

    return (
        <div>
            <Header vizControl={[viz, setViz]} />

            <main className='columns'>
                <ControlBar
                    control={{
                        year: [year, setYear],
                        action: [action, setAction],
                        filter: [filter, setFilter],
                        x: [x, (viz === 'matrice' ? setX : false)],
                        y: [y, setY],
                        aggregate: [aggregate, setAggregate],
                        displayNullValues: [displayNullValues, setDisplayNullValues],
                        additionalFilters: [additionalFilters, setAdditionalFilters]
                    }}
                    filterValues={[
                        ...xValues.map((value) => { return { value: value, field: 'x' } }),
                        ...yValues.map((value) => { return { value: value, field: 'y' } })
                    ]}
                    sourceControl={[source, setSource]}
                    fields={fields}
                />

                {
                    viz === 'matrice' &&
                    <Matrix
                        data={data}
                        control={{
                            year: year,
                            action: action,
                            filter: filter,
                            x: x,
                            y: y,
                            aggregate: aggregate,
                            displayNullValues: displayNullValues,
                            additionalFilters: additionalFilters
                        }}
                    />
                }

                {
                    viz === 'histogramme' &&
                    <Histogram
                        data={data}
                        control={{
                            year: year,
                            action: action,
                            filter: filter,
                            x: x,
                            y: y,
                            aggregate: aggregate,
                            displayNullValues: displayNullValues,
                            additionalFilters: additionalFilters
                        }}
                    />
                }
            </main>
        </div>
    )
}