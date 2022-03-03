import React, { useState, useEffect } from 'react';

import { fetchData, fetchFields } from '../utils/fetch';

import Loader from './Loader';
import Viz from './Viz';
import Header from './Header';

export default function App ({

}) {
    /** @type {[Object, Function]} Data */
    const [data, setData] = useState(null);
    /** @type {[Object[], Function]} Fields */
    const [fields, setFields] = useState(null);
    /**
     * @type {[Object, Function]}
     * @typedef {Object} sourceFiles
     * @property {string} data file **.csv
     * @property {string} fields file **.json
     */
    const [sourceFiles, setSourceFiles] = useState({
        data: 'pointcalls.csv',
        fields: 'navigo-pointcalls-fields.json'
    });
    /**
     * @type {['loading'|'failed'|'success', Function]}
     * @typedef {Function} setLoadingState Set the app state of fetch
     */
    const [loadingState, setLoadingState] = useState('loading');
    /**
     * @type {[string, Function]}
     * @typedef {Function} setTitle Set the app page title
     */
    const [title, setTitle] = useState(null);
    /**
     * @type {['matrice'|'histogramme'|'graphe', Function]}
     * @typedef {Function} setViz Set the app viz to display
     */
    const [viz, setViz] = useState('matrice');

    useEffect(() => {
        const { data: fileData, fields: fileFields } = sourceFiles;

        console.info('load data');
        setLoadingState('loading');

        Promise.all([fetchData(fileData), fetchFields(fileFields)])
            .then(([data, fields]) => {
                setData(data);

                setFields(fields);
                setLoadingState('success');
            })
            .catch((error) => {
                console.error(error);
                setLoadingState('failed');
            })
    }, [sourceFiles]);

    useEffect(() => {
        let newSource;
        switch (viz) {
            case 'matrice':
                newSource = {
                    data: 'pointcalls.csv',
                    fields: 'navigo-pointcalls-fields.json'
                }
                break;
            case 'histogramme':
                newSource = {
                    data: 'pointcalls.csv',
                    fields: 'navigo-pointcalls-fields.json'
                }
                break;
            case 'graphe':
                newSource = {
                    data: 'graph-flows.csv',
                    fields: 'navigo-flows-graph-fields.json'
                }
                break;

            }

        if (JSON.stringify(newSource) !== JSON.stringify(sourceFiles)) {
            setSourceFiles(newSource);
        }
    }, [viz]);

    const routes = {
        'success':
            <Viz
                data={data}
                fields={fields}
                type={viz}
                sourceFilesState={[sourceFiles, setSourceFiles]}
            />,
        'loading': <Loader message="Chargement en cours" />,
        'failed': <Loader message="Échec du chargement" />
    }

    return (
        <>
            <Header vizState={[viz, setViz]} />
            { routes[loadingState] }
        </>
    );
    
}