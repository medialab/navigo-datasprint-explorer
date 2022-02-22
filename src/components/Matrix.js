import React, { useRef, useEffect } from 'react';
import slug from 'slug';
import { VegaLite } from 'react-vega';

export default function Matrix({
    control,
    data: inputData
}) {
    for (const key in control) {
        try {
            control[key] = JSON.parse(control[key]);
        } catch (error) {
            console.error(error);
        }
    }

    let spec = {
        // "width": 1500,
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
            ] : [])
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
        // console.log(spec);
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