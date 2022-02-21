import React, { useState, useEffect } from 'react';
import { VegaLite } from 'react-vega';

export default function Matrix({
    control,
    data:inputData
}) {
    for (const key in control) {
        try {
            control[key] = JSON.parse(control[key]);
        } catch (error) {
            console.error(error);
        }
    }

    let spec = {
        // "width": 800,
        // "height": 1000,
        "title": `${control.x.title} comparé à ${control.y.title} en ${control.year.filter.equal} filtré par action ${control.action.filter.equal} et pour l'ensemble ${control.filter.filter.equal}`,
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
            control.action
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
                flex: '4'
            }}
        >
            <VegaLite spec={spec} data={data} />
        </div>
    );
}