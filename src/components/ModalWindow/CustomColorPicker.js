import React from 'react'

import { CustomPicker } from 'react-color'
import { Saturation, Hue, Alpha } from 'react-color/lib/components/common'

export const MyPicker = ({ color, hex, hsl, hsv, onChange, customPointer }) => {
    
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
    return (
        <div>
            <div className='saturation-color' style={{ borderRadius: "8px", width: "100%", height: "147px", position: "relative", display: 'flex' }}>
                <Saturation
                    pointer={customPointer}
                    color={color}
                    hsl={hsl}
                    hsv={hsv}
                    onChange={onChange}
                />
            </div>
            <div style={styles.hue}>
                <Hue
                    pointer={customPointer}
                    color={color}
                    hsl={hsl}
                    hsv={hsv}
                    onChange={onChange}
                />
            </div>
            <div className='alpha-color' style={styles.hue}>
                <Alpha
                    pointer={customPointer}
                    // color={color}
                    hsl={hsl}
                    // hsv={hsv}
                    color={color}
                    rgb={color}
                    onChange={onChange}
                />
            </div>

        </div>
    )
}

export default CustomPicker(MyPicker)