import React, { useState, useEffect } from 'react';
import ControSelect from './ControlSelect';
import fields from '../navigo-pointcalls-fields.json'

export default function ControlBar({
    control,
    filterValues
}) {
    const [year, setYear] = control.year;
    const [action, setAction] = control.action;
    const [filter, setFilter] = control.filter;
    const [x, setX] = control.x;
    const [y, setY] = control.y;
    const [aggregate, setAggregate] = control.aggregate;
    const [displayNullValues, setDisplayNullValues] = control.displayNullValues;
    const [additionalFilters, setAdditionalFilters] = control.additionalFilters

    function addInputFilter (field) {
        switch (field) {
            case 'x':
                setAdditionalFilters([
                    ...additionalFilters,
                    { value: '', action: 'exclude', field: field }
                ])
                break;

            case 'y':
                setAdditionalFilters([
                    ...additionalFilters,
                    { value: '', action: 'exclude', field: field }
                ]);
                break;
        }
    }

    function removeInputFilter (inputKey) {
        setAdditionalFilters(
            additionalFilters.filter((filter, i) => i !== inputKey)
        )
    }

    function onChangeInputFilter (value, inputKey, field) {
        switch (field) {
            case 'x':
                setAdditionalFilters(
                    additionalFilters.map((filter, i) => {
                        if (i === inputKey) {
                            filter.value = value;
                            filter.field = field;
                            return filter;
                        }
                        return filter;
                    })
                );
                break;

            case 'y':
                setAdditionalFilters(
                    additionalFilters.map((filter, i) => {
                        if (i === inputKey) {
                            filter.value = value;
                            filter.field = field;
                            return filter;
                        }
                        return filter;
                    })
                );
                break;
        }

    }

    return (
        <form
            className='column'
            style={{
                flex: '1',
                minWidth: '250px'
            }}
            onSubmit={(e) => { e.preventDefault() }}
        >

            <ControSelect
                label="Voir l'année"
                name='year'
                value={year}
                setter={setYear}
                options={
                    fields.years.map(
                        (item) => {
                            return {
                                value: `{ "filter": { "field": "year", "equal": "${item.value}" } }`,
                                label: item.label
                            }
                        }
                    )
                }
            />

            <ControSelect
                label='Voir les pointcalls avec action'
                name='action'
                value={action}
                setter={setAction}
                options={
                    fields.actions.map(
                        (item) => {
                            return {
                                value: `{ "filter": { "field": "pointcall_action", "equal": "${item.value}" } }`,
                                label: item.label
                            }
                        }
                    )
                }
            />

            <ControSelect
                label='Voir les pointcalls de'
                name='filter'
                value={filter}
                setter={setFilter}
                options={
                    fields.filters.map(
                        (item) => {
                            return {
                                value: `{"filter": { "field": "${item.field}", "equal": "${item.value}" } }`,
                                label: item.label
                            }
                        }
                    )
                }
            />

            <ControSelect
                label='Axe X'
                name='x'
                value={x}
                setter={setX}
                options={
                    fields.groups.map(
                        (item) => {
                            return {
                                value: `{ "field": "${item.field}", "type": "nominal", "axis": { "orient": "top" }, "title": "${item.label}" }`,
                                label: item.label
                            }
                        }
                    )
                }
            />

            <ControSelect
                label='Axe Y'
                name='y'
                value={y}
                setter={setY}
                options={
                    fields.groups.map(
                        (item) => {
                            return {
                                value: `{ "field": "${item.field}", "type": "nominal", "sort": "-color", "title": "${item.label}" }`,
                                label: item.label
                            }
                        }
                    )
                }
            />

            <ControSelect
                label='Agrégation par'
                name='aggregate'
                value={aggregate}
                setter={setAggregate}
                options={
                    fields.aggregation.map(
                        (item) => {
                            return {
                                value: `{"aggregate": "${item.aggregate}", "field": "${item.field}"}`,
                                label: item.label
                            }
                        }
                    )
                }
            />

            <label className="checkbox">
                <input
                    type="checkbox"
                    checked={displayNullValues}
                    onChange={(e) => { setDisplayNullValues(!displayNullValues) }}
                />

                Afficher les valeurs <em>nulles</em>
            </label>

            <details className='block'>
                <summary className='button is-info'>Filtres supplémentaires</summary>

                <div className='buttons'>
                    { setX && <button className="button is-primary" onClick={() => addInputFilter('x')}>Ajouter un filtre X</button>}
                    <button className="button is-primary" onClick={() => addInputFilter('y')}>Ajouter un filtre Y</button>
                </div>

                {
                    additionalFilters.map(({ value, field }, i) =>
                        <div style={{ display: 'flex' }} key={i}>
                            <ControSelect
                                label={`Exclure de ${field}`}
                                name={`filter-${i}`}
                                value={value}
                                setter={(value) => onChangeInputFilter(value, i, field)}
                                options={
                                    filterValues
                                        .filter(filter => filter.field === field)
                                        .map(
                                            ({value}) => {
                                                return {
                                                    value: value,
                                                    label: value
                                                }
                                            }
                                        )
                                }
                            />

                            <button
                                className="delete"
                                onClick={() => removeInputFilter(i)}
                            ></button>
                        </div>
                    )
                }
            </details>

        </form>
    );
}