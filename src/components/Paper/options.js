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

    markup: '<g class="rotatable"><g class="scalable"><polygon class="polygon"/><image class="image"/></g><text/></g>',

    defaults: {
        ...joint.dia.Element.prototype.defaults,
        type: 'custom.Diamond',
        attrs: diamondAttrs

    }
}).define('custom.Diamond', {
    // markup: '<g class="rotatable"><g class="scalable"><polygon class="polygon"/><image class="image"/></g><text/></g>',

    markup: [{
        tagName: "polygon",
        selector: "polygon"
    },
    {
        tagName: "image",
        selector: "image"
    },
    {
        tagName: "text",
        selector: "text"
    }],
    attrs: diamondAttrs

}, {
    // initialize: () => {
    // //   this.on("change:header", () => {console.log('header change')}, this), joint.dia.Element.prototype.initialize.apply(this, arguments)
    //     console.log("initialize")
    //     return true;
    // },
    markup: [{
        tagName: "polygon",
        selector: "polygon"
    },
    {
        tagName: "image",
        selector: "image"
    },
    {
        tagName: "text",
        selector: "text"
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