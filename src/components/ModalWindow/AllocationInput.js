import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function AllocationInput(props) {

    let {actionIndex, activeLink, setAllocation} = props;

    let linkLabel = activeLink && activeLink.label(0);
    let defaultInputValue = linkLabel ? linkLabel.attrs.text.allocation : 50;
    let [allocationValue, setAllocationValue] = useState(defaultInputValue);

    const handleChange = (theValue) => {
        const re = /^[0-9\b]+$/;
        if ((theValue === '' || re.test(theValue)) && theValue >= 0 && theValue <= 100) {
            // setAllocation(theValue);
            props.setAction(actionValue => {
                if (!actionValue[actionIndex]) {
                    actionValue.push({ allocation: theValue });
                } else {
                    actionValue.splice(actionIndex, 1, { ...actionValue[actionIndex], allocation: theValue });
                }
                return [...actionValue];
            });
            setAllocationValue(theValue);
        }

    }

    const percentagesValues = [20, 50, 75, 100];

    const mapPercentagesButtons = (p) => {
        return (
            <div
                key={`percentage-button-${p}-${allocationValue}`}
                onClick={
                    () => {
                        handleChange(p);
                    }
                }
                className={(p == allocationValue && "matched-modal-option-button") || ""}
            >
                {p}%
            </div>
        );
    }


    useEffect(() => {
        let linkLabel = activeLink && activeLink.label(0);
        let defaultInputValue = linkLabel ? linkLabel.attrs.text.allocation : 50;
        setAllocationValue(defaultInputValue)
    }, [])

    return (

        <div className="modal-option">
            <div className="modal-option-title">Allocation</div>
            <div
                className="hold-select-action"
            >
                <input
                    name="allocation"
                    key={defaultInputValue}
                    className='allocation-input'
                    onChange={e => {
                        handleChange(e.target.value);
                    }}
                    value={allocationValue}
                />
            </div>
            <div className='hold-modal-option-button'>
                {percentagesValues.map((p) => mapPercentagesButtons(p))}
            </div>
        </div>
    )
}