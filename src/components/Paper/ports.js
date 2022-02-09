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

const portAttrs = {
    portBody: {
        magnet: true,
        r: 6,
        fill: 'white',
        stroke: '#023047',
        ...portSizes
    },
    portBody2: {
        magnet: true,
        r: 26,
        fill: 'rgba(0,0,0,0)',
        // stroke: '#023047',
        stroke: 'rgba(0,0,0,0)',
        ...portSizes
    }
}

const rootPortAttrs = {
    portBody: {
        magnet: true,
        r: 6,
        fill: '#023047',
        stroke: '#023047',
        ...portSizes
    },
    // portBody2: {
    //     magnet: true,
    //     r: 26,
    //     fill: 'rgba(0,0,0,0)',
    //     // stroke: '#023047',
    //     stroke: 'rgba(0,0,0,0)',
    //     ...portSizes
    // }
}

const portMarkup = [{
        tagName: 'circle',
        selector: 'portBody'
    },
    // {
    //     tagName: 'circle',
    //     selector: 'portBody2'
    // }
];

export const ports = {
    portRight: {
        group: "right",
        position: {
            name: 'right'
        },
        attrs: portAttrs,
        markup: portMarkup
        // markup: '<circle joint-selector="c1" class="c1"/><circle class="c2"/>'
    },
    portLeft: {
        group: "left",
        position: {
            name: 'left',
        },
        attrs: portAttrs,
        markup: portMarkup
    },
    portTop: {
        group: "top",
        position: {
            name: 'top',
        },
        attrs: portAttrs,
        markup: portMarkup
    },
    portBottom: {
        group: "bottom",
        position: {
            name: 'bottom',
        },
        attrs:portAttrs,
        markup: portMarkup
    },
    rootPortBottom: {
        group: "bottom",
        position: {
            name: 'bottom',
        },
        attrs: rootPortAttrs,
        markup: portMarkup
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
        {...ports.portBottom, attrs: rootPortAttrs},
        {...ports.portLeft, attrs: rootPortAttrs},
        {...ports.portRight, attrs: rootPortAttrs},
        {...ports.portTop, attrs: rootPortAttrs},
        // ports.portRight, ports.portTop, ports.portBottom
        // ports.rootPortBottom
    ]
}