import React, { useState, useEffect } from "react";

export default function CustomSelect(props) {

    let [openSelect, setOpenSelect] = useState(false);
    let [selectedOption, setSelectedOption] = useState("");
    let { options } = props;

    useEffect(() => {
        setSelectedOption(options[0].value);
    }, []);

    const mapOptions = (option) => {
        if (option.hidden) {
            return <div key={`select-hidden-${option.value}`} style={{display: "none"}}></div>
        }
        return <div
            className="custom-option"
            key={`select-${option.value}`}
            onClick={() => {
                setSelectedOption(option.value);
                setOpenSelect(false);
            }}
        >
            {option.value}
        </div>
    }

    return <div onClick={() => { setOpenSelect(!openSelect); }} className="custom-select">
        <div
            className="selected-option"
        >{selectedOption}</div>
        {openSelect &&
            <div className="hold-custom-options">
                {options.map(mapOptions)}
            </div>
        }
    </div>
}