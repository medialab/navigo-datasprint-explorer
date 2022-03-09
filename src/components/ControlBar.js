import React from 'react';
import ControlSelect from './ControlSelect';
import ControlAdditionalFilters from './ControlAdditionalFilters';

export default function ControlBar ({
    fields,
    type,

    xValues,
    yValues,

    sourceFilesState,
    yearState,
    actionState,
    filtersState,
    xState,
    yState,
    aggregateState,
    displayNullValuesState,
    additionalFiltersXState,
    additionalFiltersYState
}) {
    const [year, setYear] = yearState;
    const [action, setAction] = actionState;
    const [filters, setFilters] = filtersState;
    const [x, setX] = xState;
    const [y, setY] = yState;
    const [aggregate, setAggregate] = aggregateState;
    const [displayNullValues, setDisplayNullValues] = displayNullValuesState;
    const [sourceFiles, setSourceFiles] = sourceFilesState;

    return (
        <form
            className='column'
            style={{
                flex: '1',
                minWidth: '250px'
            }}
            onSubmit={(e) => { e.preventDefault() }}
        >
            {
                type !== 'graphe' &&
                <ControlSelect
                    label="Voir la source"
                    value={JSON.stringify(sourceFiles)}
                    setter={(input) => setYear(JSON.parse(input))}
                    options={
                        [
                            { data: 'pointcalls.csv', fields: 'navigo-pointcalls-fields.json' },
                            { data: 'flows.csv', fields: 'navigo-flows-fields.json' }
                        ].map(
                            (item) => {
                                return {
                                    value: JSON.stringify(item),
                                    label: item.data
                                }
                            }
                        )
                    }
                />
            }

            {
                year &&
                <ControlSelect
                    label="Voir l'année"
                    value={JSON.stringify(year)}
                    setter={(input) => setYear(JSON.parse(input))}
                    options={
                        fields.years.map(
                            (item) => {
                                return {
                                    value: JSON.stringify(item),
                                    label: item.label
                                }
                            }
                        )
                    }
                />
            }

            {
                action && type !== 'graphe' &&
                <ControlSelect
                    label="Voir avec action"
                    value={JSON.stringify(action)}
                    setter={(input) => setAction(JSON.parse(input))}
                    options={
                        fields.actions.map(
                            (item) => {
                                return {
                                    value: JSON.stringify(item),
                                    label: item.label
                                }
                            }
                        )
                    }
                />
            }

            {
                filters &&
                <ControlSelect
                    label="Voir"
                    value={JSON.stringify(filters)}
                    setter={(input) => setFilters(JSON.parse(input))}
                    options={
                        fields.filters.map(
                            (item) => {
                                return {
                                    value: JSON.stringify(item),
                                    label: item.label
                                }
                            }
                        )
                    }
                />
            }

            {
                x && type === 'matrice' &&
                <ControlSelect
                    label="Axe X"
                    value={JSON.stringify(x)}
                    setter={(input) => setX(JSON.parse(input))}
                    options={
                        fields.groups.map(
                            (item) => {
                                return {
                                    value: JSON.stringify(item),
                                    label: item.label
                                }
                            }
                        )
                    }
                />
            }

            {
                y &&
                <ControlSelect
                    label="Axe Y"
                    value={JSON.stringify(y)}
                    setter={(input) => setY(JSON.parse(input))}
                    options={
                        fields.groups.map(
                            (item) => {
                                return {
                                    value: JSON.stringify(item),
                                    label: item.label
                                }
                            }
                        )
                    }
                />
            }

            {
                aggregate &&
                <ControlSelect
                    label="Aggrégé par"
                    value={JSON.stringify(aggregate)}
                    setter={(input) => setAggregate(JSON.parse(input))}
                    options={
                        fields.aggregation.map(
                            (item) => {
                                return {
                                    value: JSON.stringify(item),
                                    label: item.label
                                }
                            }
                        )
                    }
                />
            }

            <label className="checkbox">
                <input
                    type="checkbox"
                    checked={displayNullValues}
                    onChange={(e) => { setDisplayNullValues(!displayNullValues) }}
                />

                Afficher les valeurs <em>nulles</em>
            </label>

            <ControlAdditionalFilters
                type={type}

                xValues={xValues}
                yValues={yValues}
                x={x}
                y={y}
                additionalFiltersXState={additionalFiltersXState}
                additionalFiltersYState={additionalFiltersYState}
            />
        </form>
    );
}