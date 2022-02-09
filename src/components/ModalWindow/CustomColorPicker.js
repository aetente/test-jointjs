import React from 'react'

import { CustomPicker } from 'react-color'
import { Saturation, Hue } from 'react-color/lib/components/common'

export const MyPicker = ({ color, hex, hsl, hsv, onChange }) => {
    const styles = {
        hue: {
            height: 10,
            position: 'relative',
            marginBottom: 10,
            marginTop: 22,
            borderRadius: 25
        },
        input: {
            height: 34,
            border: `1px solid ${hex}`,
            paddingLeft: 10,
            width: "100%"
        },
        swatch: {
            width: 54,
            height: 38,
            background: hex,
        },
    }
    console.log(hsl, hsv)
    return (
        <div>
            <div style={{ borderRadius: "8px", width: "100%", height: "147px", position: "relative", display: 'flex' }}>
                <Saturation
                    color={color}
                    hsl={hsl}
                    hsv={hsv}
                    onChange={onChange}
                />
            </div>
            <div style={styles.hue}>
                <Hue
                    color={color}
                    hsl={hsl}
                    hsv={hsv}
                    onChange={onChange}
                />
            </div>

        </div>
    )
}

export default CustomPicker(MyPicker)