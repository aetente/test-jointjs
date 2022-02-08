const portSizes = {
    // width: 112,
    // height: 112,
    // stroke: 'rgba(0,0,0,0)',
    // outline: '3px solid #023047',
    // strokeWidth: 96,
} 

// 'myPorts': {
//     position: 'top',
//     attrs: {
//       '.port-body': {
//         stroke: 'red',
//         strokeWidth: 2,
//         height: 10,
//         width: 10,
//         magnet: true
//       }
//     },
//     markup: '<rect class="port-body"/>'
//   }

export const ports = {
    portRight: {
        group: "right",
        position: {
            name: 'right'
        },
        attrs: {
            portBody: {
                magnet: true,
                r: 6,
                fill: 'white',
                stroke: '#023047',
                ...portSizes
            }
        },
        label: {
            position: {
                name: 'right',
            },
            markup: [{
                tagName: 'text',
                selector: 'label'
            }]
        },
        markup: [{
            tagName: 'circle',
            selector: 'portBody'
        }]
    },
    portLeft: {
        group: "left",
        position: {
            name: 'left',
        },
        attrs: {
            portBody: {
                magnet: true,
                r: 6,
                fill: 'white',
                stroke: '#023047',
                ...portSizes
            }
        },
        label: {
            position: {
                name: 'left',
            },
            markup: [{
                tagName: 'text',
                selector: 'label'
            }]
        },
        markup: [{
            tagName: 'circle',
            selector: 'portBody'
        }]
    },
    portTop: {
        group: "top",
        position: {
            name: 'top',
        },
        attrs: {
            portBody: {
                magnet: true,
                r: 6,
                fill: 'white',
                stroke: '#023047',
                ...portSizes
            }
        },
        label: {
            position: {
                name: 'top',
            },
            markup: [{
                tagName: 'text',
                selector: 'label'
            }]
        },
        markup: [{
            tagName: 'circle',
            selector: 'portBody'
        }]
    },
    portBottom: {
        group: "bottom",
        position: {
            name: 'bottom',
        },
        attrs: {
            portBody: {
                magnet: true,
                r: 6,
                fill: 'white',
                stroke: '#023047',
                ...portSizes
            }
        },
        label: {
            position: {
                name: 'bottom',
            },
            markup: [{
                tagName: 'text',
                selector: 'label'
            }]
        },
        markup: [{
            tagName: 'circle',
            selector: 'portBody'
        }]
    },
    rootPortBottom: {
        group: "bottom",
        position: {
            name: 'bottom',
        },
        attrs: {
            portBody: {
                magnet: true,
                r: 6,
                fill: '#023047',
                stroke: '#023047',
                ...portSizes
            },
            '.': { magnet: true }
        },
        label: {
            position: {
                name: 'bottom',
            },
            markup: [{
                tagName: 'text',
                selector: 'label'
            }]
        },
        markup: [{
            tagName: 'circle',
            selector: 'portBody'
        }]
    }
}

export const portCellOptions = {
    groups: {
        'top': {
            position: "top"
        },
        "bottom": {
            position: "bottom"
        },
        "right": {
            position: "right"
        },
        "left": {
            position: "left"
        },
    },
    items: [
        ports.portLeft, ports.portRight, ports.portTop, ports.portBottom
    ]
};
export const rootPortCellOptions = {
    groups: {
        'top': {
            position: "top"
        },
        "bottom": {
            position: "bottom"
        },
        "right": {
            position: "right"
        },
        "left": {
            position: "left"
        },
    },
    items: [
        {...ports.portBottom, attrs: { portBody: {...ports.portBottom.attrs.portBody, fill: '#023047', }}},
        {...ports.portLeft, attrs: { portBody: {...ports.portLeft.attrs.portBody, fill: '#023047', }}},
        {...ports.portRight, attrs: { portBody: {...ports.portRight.attrs.portBody, fill: '#023047', }}},
        {...ports.portTop, attrs: { portBody: {...ports.portTop.attrs.portBody, fill: '#023047', }}},
        // ports.portRight, ports.portTop, ports.portBottom
        // ports.rootPortBottom
    ]
}