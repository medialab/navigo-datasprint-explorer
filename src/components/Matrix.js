import React, { useRef, useEffect } from 'react';
import slug from 'slug';
import { VegaLite } from 'react-vega';

export default function Matrix({
    control,
    data: inputData
}) {
    for (const key in control) {
        if (typeof control[key] !== 'string') {
            continue;
        }

        try {
            control[key] = JSON.parse(control[key]);
        } catch (error) {

        }
    }

    let spec = {
        'padding': { 'top': 10, 'left': 50, 'bottom': 50, right: 10 },
        "title": `${control.x.title} comparé à ${control.y.title} en ${control.year.filter.equal} filtré par action ${control.action.filter.equal} et pour l'ensemble ${control.filter.filter.field}`,
        "data": { "name": "table" },
        "mark": "rect",
        "encoding": {
            "y": control.y,
            "x": control.x,
            "color": control.aggregate
        },
        'transform': [
            control.filter,
            control.year,
            control.action,
            ...(control.displayNullValues === false ? [
                { "filter": `datum.${control.x.field} != ''` },
                { "filter": `datum.${control.y.field} != ''` }
            ] : []),
            ...control.additionalFilters
                .filter(filter => filter.action === 'exclude' && filter.field === 'x')
                .map((filter) => {
                    return { "filter": `datum.${control.x.field} != "${filter.value}"` }
                }),
            ...control.additionalFilters
                .filter(filter => filter.action === 'exclude' && filter.field === 'y')
                .map((filter) => {
                    return { "filter": `datum.${control.y.field} != "${filter.value}"` }
                })
        ],
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
                downloadFileName={slug(spec.title)}
            />
        </div>
    );
}