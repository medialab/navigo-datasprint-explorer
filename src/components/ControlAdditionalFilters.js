import React from 'react';
import ControlSelect from './ControlSelect';

export default function ControlAdditionalFilters({
    type,

    xValues,
    yValues,
    x,
    y,
    additionalFiltersXState,
    additionalFiltersYState
}) {
    const [additionalFiltersX, setAdditionalFiltersX] = additionalFiltersXState;
    const [additionalFiltersY, setAdditionalFiltersY] = additionalFiltersYState;

    if (type !== 'matrice') {
        x = false;
    }

    function addInputFilterX () {
        setAdditionalFiltersX([
            ...additionalFiltersX,
            { value: xValues[0], action: 'exclude' }
        ])
    }

    function addInputFilterY () {
        setAdditionalFiltersY([
            ...additionalFiltersY,
            { value: yValues[0], action: 'exclude' }
        ])
    }

    function changeInputFilterX (value, inputKey) {
        setAdditionalFiltersX([
            ...additionalFiltersX.map((filter, i) => {
                if (i === inputKey) {
                    filter.value = value;
                    return filter;
                }
                return filter;
            })
        ])
    }

    function changeInputFilterY (value, inputKey) {
        setAdditionalFiltersY([
            ...additionalFiltersY.map((filter, i) => {
                if (i === inputKey) {
                    filter.value = value;
                    return filter;
                }
                return filter;
            })
        ])
    }

    function removeInputFilterX (inputKey) {
        setAdditionalFiltersX(
            additionalFiltersX.filter((filter, i) => i !== inputKey)
        )
    }

    function removeInputFilterY (inputKey) {
        setAdditionalFiltersY(
            additionalFiltersY.filter((filter, i) => i !== inputKey)
        )
    }

    return (
        <details className='block'>
            <summary className='button is-info'>Filtres supplémentaires</summary>

            <div className='buttons'>
                {x && <button className="button is-primary" onClick={addInputFilterX}>Ajouter un filtre X</button>}
                {y && <button className="button is-primary" onClick={addInputFilterY}>Ajouter un filtre Y</button>}
            </div>

            {
                x &&
                additionalFiltersX.map(({ value, field }, i) =>
                    <div style={{ display: 'flex' }} key={i}>
                        <ControlSelect
                            label="Exclure de X"
                            value={value}
                            setter={(value) => changeInputFilterX(value, i)}
                            options={
                                xValues
                                    .map((value) => {
                                        return {
                                            value: value,
                                            label: value
                                        }
                                    })
                            }
                        />

                        <button
                            className="delete"
                            onClick={() => removeInputFilterX(i)}
                        ></button>
                    </div>
                )
            }

            {
                y &&
                additionalFiltersY.map(({ value }, i) =>
                    <div style={{ display: 'flex' }} key={i}>
                        <ControlSelect
                            label="Exclure de Y"
                            value={value}
                            setter={(value) => changeInputFilterY(value, i)}
                            options={
                                yValues
                                    .map((value) => {
                                        return {
                                            value: value,
                                            label: value
                                        }
                                    })
                            }
                        />

                        <button
                            className="delete"
                            onClick={() => removeInputFilterY(i)}
                        ></button>
                    </div>
                )
            }
        </details>
    );
}