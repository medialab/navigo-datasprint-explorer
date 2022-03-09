import React, { useRef, useEffect } from 'react';
import slug from 'slug';
import { VegaLite } from 'react-vega';

export default function Histogram({
    data: inputData,

    year,
    action,
    filters,
    sourceType,
    // x,
    y,
    aggregate,
    additionalFiltersX,
    additionalFiltersY,
    displayNullValues
}) {
    // y.sort = '-x';

    let spec = {
        'padding': { 'top': 10, 'left': 50, 'bottom': 50, right: 10 },
        "title": [
            `${y.label} en ${year.label}`,
            `filtré par action ${action.label} et pour l'ensemble ${filters.label}`,
            ...(additionalFiltersX.length === 0 ? [] : [`sont exlues en X les valeurs ${additionalFiltersX.map(filter => filter.value).join(', ')}`]),
            ...(additionalFiltersY.length === 0 ? [] : [`sont exlues en Y les valeurs ${additionalFiltersY.map(filter => filter.value).join(', ')}`]),
            ...(displayNullValues === false ? [`sont exlues les valeurs nulles`] : [])
        ],
        "data": { "name": "table" },
        "mark": "bar",
        "encoding": {
            "y": { "field": y.field, "type": "nominal", "sort": "-x", "title": y.label },
            "x": { "aggregate": aggregate.aggregate, "field": aggregate.field, "title": aggregate.label }
        },
        'transform': [
            {"filter": { "field": filters.field, "equal": filters.value } },
            {"filter": { "field": year.field, "equal": year.value } },
            sourceType === 'flows' ? null : {"filter": { "field": action.field, "equal": action.value } },
            ...(displayNullValues === false ? [
                { "filter": `datum.${y.field} != ''` }
            ] : []),
            ...additionalFiltersY
                .map((filter) => {
                    return { "filter": `datum.${y.field} != "${filter.value}"` }
                }),
        ].filter(f => f),
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