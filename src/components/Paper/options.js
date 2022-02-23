import * as joint from 'jointjs';
import loopActionImage from "../../assets/images/loopActionImage.png";

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
        // let width = model.attr(['loop-ellipse', 'rx']) || 0;
        // let height = model.attr(['loop-ellipse', 'ry']) || 0;
        let width = model.attr(['loop-image', 'width']) || 0;
        let height = model.attr(['loop-image', 'height']) || 0;
        return { x: width, y: height };
    },
    setPosition: function(view, coordinates) {
        let model = view.model;
        let size = model.size();
        let rx = Math.max(coordinates.x, 0);
        let ry = Math.max(coordinates.y, 0);
        // model.attr(['loop-ellipse'], { rx: rx, ry: ry });
        // model.attr(['loop-image'], { width: rx, height: ry });
        
        model.attr(['loop-image'], { width: ry, height: ry });
    },
    resetPosition: function(view) {
        // view.model.attr(['loop-ellipse'], { rx: 100, ry: 100 });
        view.model.attr(['loop-image'], { width: 100, height: 100 });
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


const loopArrowD = "M3.90752 0.846718C4.27176 0.241728 5.13135 0.194641 5.55949 0.756228L9.6201 6.08248C10.2482 6.90639 9.36289 8.02438 8.41695 7.60178L4.91246 6.03616C4.59301 5.89345 4.22221 5.92807 3.93471 6.12744L2.26146 7.28779C1.37587 7.90192 0.279028 6.87353 0.834895 5.95025L3.90752 0.846718Z";

export const loopActionAttrs = {
    // "loop-ellipse": {
    //     rx: 100,
    //     ry: 100,
    //     stroke: '#FAC200',
    //     strokeWidth: 4,
    //     fill: 'none'
    // },
    "loop-text": {
        text: "",
        fontSize: "26px",
        // ref: "loop-ellipse",
        ref: "hold-loop-text",
        // refX: "50%",
        // refX2: -13,
        // refDy: "-7%",
        textAnchor: "middle",
        refX: "50%",
        refY: "35%",
        fontFamily: 'Roboto, sans-serif',
        fontStyle: "normal",
        fontWeight: 600,
        fill: '#ffffff',
    },
    "hold-loop-text": {
        // ref: "loop-ellipse",
        ref: "loop-image",
        refX: "50%",
        // refX2: 13,
        refDy: "-7%",
        r: "26",
        fill: '#FAC200',
        opacity: 0
    },
    "loop-image": {
        // refX: .5,
        // refY: .35,
        // yAlignment: 'middle',
        // xAlignment: 'middle',
        height: 100,
        width: 100,
        href: loopActionImage
    },
    // "loop-arrow1": {
    //     fill: '#FAC200',
    //     ref: "loop-ellipse",
    //     transform: "scale(2) rotate(180deg)",
    //     refX: "10",
    //     d: loopArrowD
    // },
    // "loop-arrow2": {
    //     fill: '#FAC200',
    //     ref: "loop-ellipse",
    //     transform: "scale(2)",
    //     refDx: "-10",
    //     d: loopArrowD
    // },
    // "loop-arrow3": {
    //     fill: '#FAC200',
    //     ref: "loop-ellipse",
    //     transform: "scale(2)  rotate(45deg)",
    //     refDy: -50,
    //     refDx: -20,
    //     d: loopArrowD
    // }
};

export const loopActionShape = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><path class="loop-arrow1" /><path class="loop-arrow2" /><path class="loop-arrow3" /><path class="loop-arrow4" /><path class="loop-arrow5" /><path class="loop-arrow6" /><ellipse class="loop-ellipse"/><circle class="hold-loop-text" /><text class="loop-text"/><image class="loop-image"/></g></g>',
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
        tagName: "image",
        selector: "loop-image",
        className: "loop-image",
    },
    {
        tagName: "circle",
        selector: "hold-loop-text",
        className: "hold-loop-text",
    },
    {
        tagName: "text",
        selector: "loop-text",
        className: "loop-text",
    },
    {
        tagName: "path",
        selector: "loop-arrow1",
        className: "loop-arrow1",
    },
    {
        tagName: "path",
        selector: "loop-arrow2",
        className: "loop-arrow2",
    },
    {
        tagName: "path",
        selector: "loop-arrow3",
        className: "loop-arrow3",
    },
    {
        tagName: "path",
        selector: "loop-arrow4",
        className: "loop-arrow4",
    },
    {
        tagName: "path",
        selector: "loop-arrow5",
        className: "loop-arrow5",
    },
    {
        tagName: "path",
        selector: "loop-arrow6",
        className: "loop-arrow6",
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
    },
    {
        tagName: "path",
        selector: "loop-arrow1",
        className: "loop-arrow1",
    },
    {
        tagName: "path",
        selector: "loop-arrow2",
        className: "loop-arrow2",
    },
    {
        tagName: "path",
        selector: "loop-arrow3",
        className: "loop-arrow3",
    },
    {
        tagName: "path",
        selector: "loop-arrow4",
        className: "loop-arrow4",
    },
    {
        tagName: "path",
        selector: "loop-arrow5",
        className: "loop-arrow5",
    },
    {
        tagName: "path",
        selector: "loop-arrow6",
        className: "loop-arrow6",
    }]
}
);