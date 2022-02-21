import React, { useContext, useState, useEffect } from 'react';
import { VizContext } from './App'

export default function ControlSelect ({
    label,
    name,
    value,
    options,
    setter
}) {
    function onChange (event) {
        setter(event.target.value);
    }

    return (
        <div
            className='block'
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <label>{ label }</label>
            <div className="select">
                <select style={{ width: '100%' }} value={value} onChange={onChange} name={name}>
                    {
                        options.map(({ value, label }, i) => <option key={i} value={value}>{ label }</option>)
                    }
                </select>
            </div>
        </div>
    );
}