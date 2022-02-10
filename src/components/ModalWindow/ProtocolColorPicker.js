import React, { useState, useRef, useCallback, useEffect } from 'react';
import CustomColorPicker from './CustomColorPicker';
import { CustomPointer } from './CustomPointer';
import "./styles.css";

export default function ProtocolColorPicker(props) {

    let { activeProtocol, setActiveProtocol, updateProtocols } = props;

    let [backgroundColor, setBackgroundColor] = useState({
        "hsl": {
            "h": 203.70106761565836,
            "s": 0.5000000000000001,
            "l": 0.2,
            "a": 1
        },
        "hex": "#19384d",
        "rgb": {
            "r": 25,
            "g": 56,
            "b": 77,
            "a": 1
        },
        "hsv": {
            "h": 203.70106761565836,
            "s": 0.6666666666666667,
            "v": 0.30000000000000004,
            "a": 1
        },
        "oldHue": 203.70106761565836,
        "source": "hex"
    })

    let [borderColor, setBorderColor] = useState({
        "hsl": {
            "h": 203.70106761565836,
            "s": 0.5000000000000001,
            "l": 0.2,
            "a": 1
        },
        "hex": "#19384d",
        "rgb": {
            "r": 25,
            "g": 56,
            "b": 77,
            "a": 1
        },
        "hsv": {
            "h": 203.70106761565836,
            "s": 0.6666666666666667,
            "v": 0.30000000000000004,
            "a": 1
        },
        "oldHue": 203.70106761565836,
        "source": "hex"
    })

    let [isBackgroundColor, setIsBackgroundColor] = useState(true);

    const hexToRgb = (hex) => {
        if (hex[0] === "#") {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        let rgbaArray = hex.split("rgba(")[1].split(")")[0].split(",");
        return {
            r: rgbaArray[0],
            g: rgbaArray[1],
            b: rgbaArray[2],
            a: rgbaArray[3]
        }
    }

    const rgbaToString = ({r,g,b,a}) => {
        return `rgba(${r},${g},${b},${a})`;
    }

    useEffect(() => {
        if (activeProtocol.backgroundColor) {
            setBackgroundColor({
                rgb: hexToRgb(activeProtocol.backgroundColor),
                hex: activeProtocol.backgroundColor,
                source: "hex"
            });
        }
        if (activeProtocol.borderColor) {
            setBorderColor({
                rgb: hexToRgb(activeProtocol.borderColor),
                "hex": activeProtocol.borderColor,
                source: "hex"
            });
        }
    }, [])

    return (

        <div className="modal-option">
            <div
                className="hold-select-action"
            >
                <div className='hold-modal-option-button'>
                    <div
                        className={`color-button ${isBackgroundColor && 'matched-modal-option-button' || ''}`}
                        onClick={() => {
                            setIsBackgroundColor(true)
                        }}
                    >Select body color</div>
                    <div
                        className={`color-button ${!isBackgroundColor && 'matched-modal-option-button' || ''}`}
                        onClick={() => {
                            setIsBackgroundColor(false)
                        }}
                    >Select stroke color</div>
                </div>
                <div className='hold-color-picker'>
                    <CustomColorPicker
                        customPointer={CustomPointer}
                        key={`${(isBackgroundColor && backgroundColor.rgb) || borderColor.rgb}`}
                        color={(isBackgroundColor && backgroundColor.rgb) || borderColor.rgb}
                        onChange={(e) => {
                            if (isBackgroundColor) {
                                setActiveProtocol({ ...activeProtocol, backgroundColor: rgbaToString(e.rgb) });
                                setBackgroundColor(e);
                            } else {
                                setActiveProtocol({ ...activeProtocol, borderColor: rgbaToString(e.rgb) });
                                setBorderColor(e);
                            }
                            updateProtocols();
                        }}
                    />
                </div>
            </div>
        </div>
    )
}