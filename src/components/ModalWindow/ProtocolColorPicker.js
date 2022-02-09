import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { ChromePicker } from 'react-color';
import CustomColorPicker from './CustomColorPicker';
import "./styles.css";

export default function ProtocolColorPicker(props) {

    let { activeProtocol, setActiveProtocol } = props;

    let [hsv, setHsv] = useState({h: 249.99999999999994, s: 0.6297999999999999, v: 0.5633, a: 1});
    let [hsl, setHsl] = useState( {h: 249.99999999999994, s: 0.45964092833163034, l: 0.38591683000000004, a: 1});
    let [color, setColor] = useState({
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
        "source": "hsl"
    })

    return (

        <div className="modal-option">
            {/* <div className="modal-option-title">Name protocol</div> */}
            <div
                className="hold-select-action"
            >
                {/* <input
                    type={"color"}
                    name="protocol-background-color"
                    // key={defaultInputValue}
                    className='token-name-input'
                    onChange={e => {
                        // props.setTokenName(e.target.value);
                        setActiveProtocol({ ...activeProtocol, backgroundColor: e.target.value });
                    }}
                // defaultValue={defaultInputValue}
                /> */}
                <CustomColorPicker
                    key={
                        `${hsv.h}-${hsv.s}-${hsv.v}`
                    }
                    // hsv={hsv}
                    // hsl={hsl}
                    color={color}
                    disableAlpha={true}
                    onChange={(e) => {
                        console.log(e)
                        setActiveProtocol({ ...activeProtocol, backgroundColor: e.hex });
                        setColor(e)
                        setHsl(e.hsl);
                        setHsv(e.hsv);
                    }}
                />
            </div>
        </div>
    )
}