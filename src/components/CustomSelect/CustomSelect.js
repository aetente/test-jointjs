import React, { useState, useEffect } from "react";

export default function CustomSelect(props) {

    let [openSelect, setOpenSelect] = useState(false);
    let [selectedOption, setSelectedOption] = useState("");
    let [listPosition, setListPosition] = useState({ x: 0, y: 0 });
    let { options, additionalClass, onChange } = props;

    useEffect(() => {
        setSelectedOption(options[0].value);
    }, []);

    const mapOptions = (option) => {
        if (option.hidden) {
            return <div key={`select-hidden-${option.value}`} style={{ display: "none" }}></div>
        }
        return <div
            className={`custom-option ${(option.img && "option-image") || ""}`}
            key={`select-${option.value}`}
            onClick={() => {
                if (option.callback) {
                    option.callback();
                } else {
                    setSelectedOption(option.value);
                    if (onChange) {
                        onChange(option);
                    }
                }
                setOpenSelect(false);
            }}
        >
            {option.img && <img src={option.img} alt="" />}
            <div>{option.value}</div>
        </div>
    }

    return <div
        onClick={(e) => {
            let target = e.target;
            let targetClass = target.getAttribute("class");
            
            if (targetClass === "selected-option") {
                target = target.parentElement;
            }
            setListPosition({ x: target.offsetLeft, y: target.offsetTop + target.offsetHeight })
            setOpenSelect(!openSelect);
        }}
        className={`custom-select ${additionalClass || ""}`}
    >
        <div
            className="selected-option"
        >
            {selectedOption}
        </div>
        {openSelect &&
            <div
                className="hold-custom-options"
                style={{
                    left: Math.round(listPosition.x),
                    top: Math.round(listPosition.y)
                }}
            >
                {options.map(mapOptions)}
            </div>
        }
    </div>
}