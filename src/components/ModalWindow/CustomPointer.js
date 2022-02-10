import React from 'react'

export const CustomPointer = ({ color }) => {

    const convertRGBToStr = () => {

        if (color) {
            return `rgb(${color.r},${color.g},${color.b})`
        }
        return "rgb(0,0,0)"
    }

    return (
        <div className='custom-pointer-wrapper'>
            <div
                style={{
                    backgroundColor: convertRGBToStr(color)
                }}
                className='custom-pointer-content' />
        </div>
    )
}

export default CustomPointer