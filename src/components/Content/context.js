import {createContext } from 'react';

export const contextValues = {
    frameDimensions: {
        w: 918 * 1.1,
        h: 532 * 1.1
    },
    // frameDimensions: {
    //     w: 3672,
    //     h: 2128
    // },
    imageSize: {
        w: 3672,
        h: 2128
    }
}

export const DiagramContext = createContext(contextValues);