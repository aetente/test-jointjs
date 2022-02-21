import * as joint from 'jointjs';

const verticesToolEditable = new joint.linkTools.Vertices({
    redundancyRemoval: false,
    stopPropagation: false
});

const verticesTool = new joint.linkTools.Vertices({
    redundancyRemoval: false,
    vertexAdding: false,
    stopPropagation: false
});
// const verticesTool = joint.linkTools.Vertices.extend({
//     interactive: (e) => {
//         console.log("click!!!");
//         return true
//     }
// })
const segmentsTool = new joint.linkTools.Segments({
    segmentLengthThreshold: 10,
    redundancyRemoval: false
});
const sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
const targetArrowheadTool = new joint.linkTools.TargetArrowhead();
const boundaryTool = new joint.linkTools.Boundary();
const removeButton = new joint.linkTools.Remove();

export const toolsView = new joint.dia.ToolsView({
    name: "toolsView",
    tools: [
        // segmentsTool,
        verticesTool,
        sourceArrowheadTool,
        targetArrowheadTool
    ]
});

export const toolsViewVertices = new joint.dia.ToolsView({
    name: "toolsViewVertices",
    tools: [
        verticesToolEditable,
        // segmentsTool,
        sourceArrowheadTool,
        targetArrowheadTool,
        removeButton
    ]
});

export const SizeTool = joint.elementTools.Control.extend({
    getPosition: function(view) {
        let model = view.model;
        let width = model.attr(['loop-ellipse', 'rx']) || 0;
        let height = model.attr(['loop-ellipse', 'ry']) || 0;
        return { x: width, y: height };
    },
    setPosition: function(view, coordinates) {
        let model = view.model;
        let size = model.size();
        let rx = Math.max(coordinates.x, 0);
        let ry = Math.max(coordinates.y, 0);
        model.attr(['loop-ellipse'], { rx: rx, ry: ry });
    },
    resetPosition: function(view) {
        view.model.attr(['loop-ellipse'], { rx: 100, ry: 100 });
    }
});

export const LoopActionTools = new joint.dia.ToolsView({
    tools: [new SizeTool({
        handleAttributes: { 'fill': 'orange' }
    })]
})

export const diamondAttrs = {
    polygon: {
        fill: '#FFFFFF',
        stroke: 'black',
        refPoints: "0,10 10,0 20,10 10,20",
        strokeLinejoin: "round"
    },
    image: {
        refX: .5,
        refY: .35,
        yAlignment: 'middle',
        xAlignment: 'middle',
        ref: 'polygon',
        height: 25,
        width: 25
    },
    text: {
        fontSize: 14,
        refX: .5,
        refY: .6,
        ref: 'polygon',
        yAlignment: 'middle',
        xAlignment: 'middle',
        fill: 'black',
        fontFamily: 'Poppins, sans-serif'
    }
};

export const diamondShape = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><polygon className="polygon"/><image class="image"/></g><text/></g>',

    defaults: {
        ...joint.dia.Element.prototype.defaults,
        type: 'custom.Diamond',
        attrs: diamondAttrs
    }
}).define('custom.Diamond', {
    markup: [{
        tagName: "polygon",
        selector: "polygon",
        className: "joint-cell"
    },
    {
        tagName: "image",
        selector: "image",
        className: "joint-cell"
    },
    {
        tagName: "text",
        selector: "text",
        className: "joint-cell"
    }],
    attrs: diamondAttrs

}, {
    markup: [{
        tagName: "polygon",
        selector: "polygon",
        className: "joint-cell"
    },
    {
        tagName: "image",
        selector: "image",
        className: "joint-cell"
    },
    {
        tagName: "text",
        selector: "text",
        className: "joint-cell"
    }]
});

export const rectDiamondAttrs = {
    ".rect-body": {
        fill: '#FFFFFF',
        stroke: 'black',
        width: 70,
        height: 70,
        x: 21.5,
        y: 0,
        rx: 5.25,
        strokeLinejoin: "round",
        transform: 'rotate(45, 35, 35)',
    },
    image: {
        refX: .5,
        refY: .35,
        yAlignment: 'middle',
        xAlignment: 'middle',
        ref: ".rect-body",
        height: 25,
        width: 25
    },
    text: {
        fontSize: 14,
        refX: .5,
        refY: .6,
        ref: ".rect-body",
        yAlignment: 'middle',
        xAlignment: 'middle',
        fill: 'black',
        fontFamily: 'Poppins, sans-serif'
    },
    ".pool-body": {
        fill: 'rgba(0,0,0,0)',
        stroke: 'rgba(0,0,0,0)',
        width: 45,
        height: 45,
        x: 5.5,
        y: 35,
        rx: 5.25,
        strokeLinejoin: "round",
        transform: 'rotate(45, 51, 97.5)',
    },
    ".pool-text": {
        fontSize: 14,
        refX: .5,
        refY: .5,
        ref: ".pool-body",
        yAlignment: 'middle',
        xAlignment: 'middle',
        fill: 'black',
        fontFamily: 'Poppins, sans-serif'
    }
};

export const rectDiamondShape = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect className="rect-body"/><image class="image"/></g><text/><text className="pool-text"/><rect className="pool-body"/></g>',

    defaults: {
        ...joint.dia.Element.prototype.defaults,
        type: 'custom.RectDiamond',
        attrs: rectDiamondAttrs
    }
}).define('custom.RectDiamond', {
    markup: [{
        tagName: "rect",
        selector: ".rect-body",
        className: "joint-cell rect-body"
    },
    {
        tagName: "image",
        selector: "image",
        className: "joint-cell"
    },
    {
        tagName: "text",
        selector: "text",
        className: "joint-cell"
    },{
        tagName: "rect",
        selector: ".pool-body",
        className: "joint-cell pool-body"
    },
    {
        tagName: "text",
        selector: ".pool-text",
        className: "joint-cell pool-text"
    }],
    attrs: rectDiamondAttrs

}, {
    markup: [{
        tagName: "rect",
        selector: ".rect-body",
        className: "joint-cell rect-body"
    },
    {
        tagName: "image",
        selector: "image",
        className: "joint-cell"
    },
    {
        tagName: "text",
        selector: "text",
        className: "joint-cell"
    },{
        tagName: "rect",
        selector: ".pool-body",
        className: "joint-cell pool-body"
    },
    {
        tagName: "text",
        selector: ".pool-text",
        className: "joint-cell pool-text"
    }]
});

export const frameAttrs = {
    g: {
        height: 918,
        width: 532
    },
    ".l": {
        height: 918,
        width: 10,
        stroke: 'black',
        strokeWidth: 4,
        // refPoints: "0,0 0,1",
        d: "M 0 0 L 0 532 Z"
    },
    ".t": {
        height: 10,
        width: 532,
        stroke: 'black',
        strokeWidth: 4,
        // refPoints: "0,1 1,1",
        d: "M 0 532 L 918 532 Z"
    },
    ".r": {
        height: 918,
        width: 10,
        stroke: 'black',
        strokeWidth: 4,
        // refPoints: "1,1 1,0",
        d: "M 918 532 L 918 0 Z"
    },
    ".b": {
        height: 10,
        width: 532,
        stroke: 'black',
        strokeWidth: 4,
        // refPoints: "1,0 0,0",
        d: "M 918 0 L 0 0 Z"
    },
};

export const frameShape = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><path class="l"/><path class="t"/><path class="r"/><path class="b"/></g></g>',
    defaults: {
        ...joint.dia.Element.prototype.defaults,
        type: "custom.Frame",
        size: {
            width: 918,
            height: 532
        },
        attrs: frameAttrs
    }
})
.define("custom.Frame", {
    // markup: '<g class="rotatable"><g class="scalable"><polygon class="polygon"/><image class="image"/></g><text/></g>',

    markup: [{
        tagName: "g",
        selector: "g"
    },
    {
        tagName: "path",
        selector: ".l",
        className: "l",
    },
    {
        tagName: "path",
        selector: ".t",
        className: "t",
    },
    {
        tagName: "path",
        selector: ".r",
        className: "r",
    },
    {
        tagName: "path",
        selector: ".b",
        className: "b",
    }],
    attrs: frameAttrs

}, {
    markup: [{
        tagName: "g",
        selector: "g"
    },
    {
        tagName: "path",
        selector: ".l",
        className: "l",
    },
    {
        tagName: "path",
        selector: ".t",
        className: "t",
    },
    {
        tagName: "path",
        selector: ".r",
        className: "r",
    },
    {
        tagName: "path",
        selector: ".b",
        className: "b",
    }]
}
);




export const loopActionAttrs = {
    "loop-ellipse": {
        rx: 100,
        ry: 100,
        stroke: 'black',
        strokeWidth: 4,
        strokeDasharray: '5 5',
        fill: 'none'
    },
    "loop-text": {
        text: "",
        fontSize: "26px",
        ref: "loop-ellipse",
        refX: -15,
        refY: -15,
        fontFamily: 'Roboto, sans-serif',
        fontStyle: "normal",
        fontWeight: 600,
        fill: '#ff0000',
    }
};

export const loopActionShape = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><ellipse class="loop-ellipse"/><text class="loop-text"/></g></g>',
    defaults: {
        ...joint.dia.Element.prototype.defaults,
        type: "custom.LoopAction",
        size: {
            width: 100,
            height: 100
        },
        attrs: loopActionAttrs
    }
})
.define("custom.LoopAction", {
    // markup: '<g class="rotatable"><g class="scalable"><polygon class="polygon"/><image class="image"/></g><text/></g>',

    markup: [{
        tagName: "ellipse",
        selector: "loop-ellipse",
        className: "loop-ellipse"
    },
    {
        tagName: "text",
        selector: "loop-text",
        className: "loop-text",
    }],
    attrs: loopActionAttrs

}, {
    markup: [{
        tagName: "ellipse",
        selector: "loop-ellipse",
        className: "loop-ellipse"
    },
    {
        tagName: "text",
        selector: "loop-text",
        className: "loop-text",
    }]
}
);