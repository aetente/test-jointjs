import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

function handleChange(theValue, props, setAllocationValue) {
    const re = /^[0-9\b]+$/;
    if ((theValue === '' || re.test(theValue)) && theValue >= 0 && theValue <= 100) {
        props.setAllocation(theValue);
        setAllocationValue(theValue);
    }

}

const percentagesValues = [20, 50, 75, 100];

function mapPercentagesButtons(p, allocation, handleChange, props, setAllocationValue) {
    return (
        <div
            key={`percentage-button-${p}-${allocation}`}
            onClick={
                () => {
                    handleChange(p, props, setAllocationValue);
                }
            }
            className={(p == allocation && "matched-percentage") || ""}
        >
            {p}%
        </div>
    );
}

export default function AllocationInput(props) {


    let linkLabel = props.activeLink && props.activeLink.label(0);
    let defaultInputValue = linkLabel ? linkLabel.attrs.text.allocation : 50;
    let [allocationValue, setAllocationValue] = useState(defaultInputValue);

    
    useEffect(() => {
        let linkLabel = props.activeLink && props.activeLink.label(0);
        console.log(linkLabel)
        let defaultInputValue = linkLabel ? linkLabel.attrs.text.allocation : 50;
        console.log(defaultInputValue)
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
                        handleChange(e.target.value, props, setAllocationValue);
                    }}
                    value={allocationValue}
                />
            </div>
            <div className='hold-percentages'>
                {percentagesValues.map((p) => mapPercentagesButtons(p, allocationValue, handleChange, props, setAllocationValue))}
            </div>
        </div>
    )
}