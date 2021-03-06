import React from 'react';

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

    if (setter === false) { return null; }

    return (
        <div
            className='block'
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <label className='label'>{ label }</label>
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