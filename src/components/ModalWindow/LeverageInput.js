import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function LeverageInput(props) {

    let {actionIndex, activeLink } = props;

    let linkLabel = activeLink && activeLink.label(actionIndex);
    let defaultInputValue = linkLabel ? linkLabel.attrs.text.leverage : 0;
    let [leverageValue, setLeverageValue] = useState(defaultInputValue);

    const handleChange = (theValue) => {
        // const re = /^[0-9\b]+$/;
        theValue = theValue.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        // if ((theValue === '' || re.test(theValue)) && theValue >= 0 && theValue <= 100) {
            props.setAction(actionValue => {
                if (!actionValue[actionIndex]) {
                    actionValue.push({ leverage: theValue });
                } else {
                    actionValue.splice(actionIndex, 1, { ...actionValue[actionIndex], leverage: theValue });
                }
                return [...actionValue];
            });
            setLeverageValue(theValue);
        // }

    }


    useEffect(() => {
        let linkLabel = activeLink && activeLink.label(actionIndex);
        let defaultInputValue = linkLabel ? linkLabel.attrs.text.leverage : 0;
        setLeverageValue(defaultInputValue)
    }, [])

    return (

        <div className="modal-option">
            <div className="modal-option-title">Leverage/Repeat</div>
            <div
                className="hold-select-action"
            >
                <input
                    name="leverage"
                    key={defaultInputValue}
                    className='leverage-input'
                    onChange={e => {
                        handleChange(e.target.value);
                    }}
                    value={leverageValue}
                    
                />
            </div>
        </div>
    )
}