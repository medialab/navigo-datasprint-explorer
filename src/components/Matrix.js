import React, { useEffect } from 'react';
import slug from 'slug';
import { VegaLite } from 'react-vega';

export default function Matrix({
    data: inputData,

    year,
    action,
    filters,
    sourceType,
    x,
    y,
    aggregate,
    additionalFiltersX,
    additionalFiltersY,
    displayNullValues
}) {
    let spec = {
        'padding': { 'top': 10, 'left': 50, 'bottom': 50, right: 10 },
        "title": [
            `${x.label} comparé à ${y.label} en ${year.label}`,
            `filtré par action ${action.label} et pour l'ensemble ${filters.label}`,
            ...(additionalFiltersX.length === 0 ? [] : [`sont exlues en X les valeurs ${additionalFiltersX.map(filter => filter.value).join(', ')}`]),
            ...(additionalFiltersY.length === 0 ? [] : [`sont exlues en Y les valeurs ${additionalFiltersY.map(filter => filter.value).join(', ')}`]),
            ...(displayNullValues === false ? [`sont exlues les valeurs nulles`] : [])
        ],
        "data": { "name": "table" },
        "mark": "rect",
        "encoding": {
            "x": { "field": x.field, "type": "nominal", "axis": { "orient": "top" }, "title": x.label },
            "y": { "field": y.field, "type": "nominal", "sort": "-color", "title": y.label },
            "color": { "aggregate": aggregate.aggregate, "field": aggregate.field, "title": aggregate.label }
        },
        'transform': [
            {"filter": { "field": filters.field, "equal": filters.value } },
            {"filter": { "field": year.field, "equal": year.value } },
            sourceType === 'flows' ? null : {"filter": { "field": action.field, "equal": action.value } },
            ...(displayNullValues === false ? [
                { "filter": `datum.${x.field} != ''` },
                { "filter": `datum.${y.field} != ''` }
            ] : []),
            ...additionalFiltersX
                .map((filter) => {
                    return { "filter": `datum.${x.field} != "${filter.value}"` }
                }),
            ...additionalFiltersY
                .map((filter) => {
                    return { "filter": `datum.${y.field} != "${filter.value}"` }
                }),
        ].filter(f => f),
        "config": {
            "axis": { "grid": true, "tickBand": "extent" }
        }
    }

    let data = {
        table: [
            ...inputData
        ]
    }

    useEffect(() => {
        console.log(spec);
    })

    return (
        <div
            className='column'
            style={{
                flex: '4',
                overflow: 'auto'
            }}
        >
            <VegaLite
                spec={spec}
                data={data}
                renderer="svg"
                downloadFileName={slug(spec.title.join(' '))}
            />
        </div>
    );
}