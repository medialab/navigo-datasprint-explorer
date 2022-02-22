import React from 'react';

export default function ControlInput ({
    label,
    name,
    value,
    onChange
}) {
    return (
        <div
            className='block'
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <label className='label'>{ label }</label>
            <input
                className="input"
                type="text"
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}