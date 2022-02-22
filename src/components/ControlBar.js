import React, { useState, useEffect } from 'react';
import ControSelect from './ControlSelect';
import ControlInput from './controlInput';
import fields from '../navigo-pointcalls-fields.json'

export default function ControlBar({
    control
}) {
    const [year, setYear] = control.year;
    const [action, setAction] = control.action;
    const [filter, setFilter] = control.filter;
    const [x, setX] = control.x;
    const [y, setY] = control.y;
    const [aggregate, setAggregate] = control.aggregate;
    const [displayNullValues, setDisplayNullValues] = control.displayNullValues;
    const [additionalFilters, setAdditionalFilters] = control.additionalFilters

    function addInputFilter () {
        setAdditionalFilters([
            ...additionalFilters,
            { value: '', action: 'exclude' }
        ]);
    }

    function onChangeInputFilter (event, inputKey) {
        const value = event.target.value;

        setAdditionalFilters(
            additionalFilters.map((filter, i) => {
                if (i === inputKey) {
                    filter.value = value;
                    return filter;
                }
                return filter;
            })
        );
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
                label='Année'
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
                label='Action'
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
                label='Filtres'
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

            <button className="button is-primary" onClick={addInputFilter}>Ajouter un filtre</button>

            {
                additionalFilters.map(({ value }, i) =>
                <ControlInput
                    label='Filtrer les résultats'
                    key={i}
                    name={`filter-${i}`}
                    value={value}
                    onChange={(e) => { onChangeInputFilter(e, i) }}
                />)
            }
            
        </form>
    );
}