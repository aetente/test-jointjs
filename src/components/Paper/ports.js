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
                stroke: '#023047'
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
                stroke: '#023047'
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
                stroke: '#023047'
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
                stroke: '#023047'
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
                magnet: false,
                r: 6,
                fill: 'white',
                stroke: '#023047'
            },
            '.': { magnet: false }
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
        "bottom": {
            position: "bottom"
        }
    },
    items: [
        ports.rootPortBottom
    ]
}