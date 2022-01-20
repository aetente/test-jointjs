import * as joint from 'jointjs';
// import emitter from 'tiny-emitter';

//import { ee } from 'event-emitter';

// import '../node_modules/jointjs/dist/joint.min.css';

const portRight = {
    position: {
        name: 'right'
    },
    attrs: {
        portBody: {
            magnet: true,
            r: 10,
            fill: '#E6A502',
            stroke:'#023047'
        }
    },
    label: {
        position: {
            name: 'right',
            args: { y: 6, x: -6 }
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
};

const portLeft = {
    position: {
        name: 'left'
    },
    attrs: {
        portBody: {
            magnet: true,
            r: 10,
            fill: '#E6A502',
            stroke:'#023047'
        }
    },
    label: {
        position: {
            name: 'left',
            args: { y: 6 }
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
};

const CHART_PAPER_DEFAULTS = {
    width: 1700,
    height: 2000,
    perpendicularLinks: true,
    restrictTranslate: true // cannot move elements outside the paper
};

// default connector style for charts
const CHART_DEFAULT_CONNECTOR_STYLE = {
    attrs: {
        '.connection': {
            'fill': 'none',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            'stroke': '#4b4a67'
        }
    }
};

const CHART_DEFAULT_OPTIONS = {
    layoutMode: 'auto',
    cellSpacing: { // Space to leave between cells in automatic layout mode
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
    }
};

const CHART_DEFAULT_SUBCELL_BACKGROUND = 'green';
// Cell style defaults
const CHART_DEFAULT_CELL_BACKGROUND = '#7c68fd';
const CHART_DEFAULT_CELL_TEXT_COLOR = '#F1F1F1';
let CHART_DEFAULT_CELL_STYLE = {
    position: {
        x: 1,
        y: 1
    },
    size: {
        width: 300
    },
    attrs: {
        '.card': { fill: CHART_DEFAULT_CELL_BACKGROUND, stroke: '#000000' },
        '.name': {
            refX: '-40%',
            'y-alignment': 'middle',
            'x-alignment': 'middle',
            text: '',
            fill: CHART_DEFAULT_CELL_TEXT_COLOR,
            'font-size': 13,
            'font-family': 'Arial',
            'letter-spacing': 0
        }
    }
};


class GraphCell {
    constructor(options = {}) {
        let opts = CHART_DEFAULT_CELL_STYLE;
        opts = {...opts, ...options};

        this.title = '';

        if (options.title) {
            opts.attrs['.name']['text'] = options.title;
            this.title = options.title;
        }

        // this.cell = new joint.shapes.basic.Rect(opts);
        this.cell = new joint.shapes.standard.Rectangle(opts);
        this.cell.set({ports: {items: [portRight, portLeft]}})
    }

    setTitle(title) {
        this.cell.set({
            attrs: {
                '.name': { text: title }
            }
        });
    }

    setFill(fillColor) {
        this.cell.set({
            attrs: {
                '.card': {
                    fill: fillColor
                }
            }
        });
    }
}

export class Chart {
    static Cell = GraphCell;

    constructor(options = {}) {
        this.graph = new joint.dia.Graph();

        let paperOpts = CHART_PAPER_DEFAULTS;

        if (options.paper) {
            paperOpts = {...paperOpts, ...options.paper};
        }
        console.log("OPTIONS", options)
        this.layoutMode = options.layout;

        paperOpts.el = document.getElementById(options.elementID);
        paperOpts.model = this.graph;

        this.paper = new joint.dia.Paper(paperOpts);
        // setup paper events

        this.paper.on('cell:pointerclick', this.onCellClick.bind(this));
        this.paper.on('blank:pointerclick', this.onPaperclick.bind(this));

        // Other internals
        this.cells = [];
        this.links = [];
        this.selectedCell = 0;

        // this.emitter = new emitter();
        // properly link 'this', since we love es6

        this.Graph = this.Graph.bind(this);
        this.Paper = this.Paper.bind(this);
        this.on = this.on.bind(this);
        this.addCell = this.addCell.bind(this);
        this.connect = this.connect.bind(this);
        this.updateFromList = this.updateFromList.bind(this);
    }

    // Get the inner graph
    Graph() {
        return this.graph;
    }

    // Get the inner paper
    Paper() {
        return this.paper;
    }

    // Subscribe to events
    on(eventName, callback) {
        // this.emitter.on(eventName, callback);
    }

    // Unsubscribe from events. if no callback is provided, unsubscribe ALL handlers
    off(eventName, callback) {
        // this.emitter.off(eventName, callback);
    }

    // Adds a Cell to the graph. The function returns the added cell for chainability purposes
    addCell(cell, options = {}) {
        let t = this.cells.find(c => {
            return c.cell.id == cell.id;
        });

        if (t) {
            return t;
        }

        this.cells.push(cell);
        this.graph.addCell(cell.cell);
        return cell;
    }

    // Connects two cells. If autoBreakpoints == false, breakpoints array is used instead
    // The source and target must be an instance of Cell and previously added to the graph.
    // The function returns the added cell for chainability purposes
    connect(source, target, label = '', breakpoints = []) {


        // let opts = joint.util.deepSupplement({
        //     source: { id: source.cell.id },
        //     target: { id: target.cell.id },
        //     vertices: breakpoints
        // }, CHART_DEFAULT_CONNECTOR_STYLE);

        let opts = {
            source: { id: source.cell.id },
            target: { id: target.cell.id },
            vertices: breakpoints,
            attrs: {
                '.marker-source': { fill: 'none', stroke: 'none' },
                '.marker-target': { fill: '#4b4a67', stroke: '#4b4a67', d: 'M 10 0 L 0 5 L 10 10 z' }
            },
            labels: [
                {
                    position: 0.5,
                    attrs: {
                        text: {
                            text: label
                        }
                    }
                }
            ]
        };
        /*
        var link6 = new joint.dia.Link({
            source: { x: 10, y: 200 },
            target: { x: 350, y: 200 },
            attrs: {
                '.marker-source': { fill: '#4b4a67', stroke: '#4b4a67', d: 'M 10 0 L 0 5 L 10 10 z'},
                '.marker-target': { fill: '#4b4a67', stroke: '#4b4a67', d: 'M 10 0 L 0 5 L 10 10 z' }
            },
            labels: [
                { position: 0.5, attrs: { text: { text: 'label' } } }
            ]
        });
        */
        let connector = new joint.shapes.standard.Link({
            ...opts, line: {
                stroke: "#3498DB",
                strokeWidth: 2,
                width: 30,
                sourceMarker: {
                    // type: "circle",
                    // stroke: "#3498DB",
                    // strokeWidth: 10,
                    // fill: "none",
                    // cx: "10",
                    // cy: "10",
                    // r: "10"
                },
                targetMarker: {
                    type: "circle",
                    stroke: "#3498DB",
                    fill: "#ffffff",
                    cx: "0",
                    cy: "0",
                    r: "6"
                }
            }
        });
        connector.router('manhattan');
        this.graph.addCell(connector);

        // this.emitter.emit('connection-added', connector, source, target);
        return connector;
    }

    // events

    onCellClick(cellView) {
        let url = cellView.model.attributes.attrs.explanation.url;
        // window.open(url, '_blank');
    }

    // Invoked on mouse click at blank paper
    onPaperclick() {
        this.unsetSelection();
    }

    findCellByTitle(title) {
        let result = this.cells.filter(cell => cell.title === title);
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    setSelection(cellView) {
        if (this.selectedCell && cellView != this.selectedCell) {
            this.selectedCell.unhighlight();
        }

        this.selectedCell = cellView;
        this.selectedCell.highlight();

        // this.emitter.emit('selection-changed', this.selectedCell);
    }

    unsetSelection() {
        if (this.selectedCell) {
            this.selectedCell.unhighlight();
        }
        this.selectedCell = null;

        // this.emitter.emit('selection-changed', this.selectedCell);
    }

    updateFromList(list) {
        _populateFromList(this, list);
    }
}


// Populate a chart from a list. The chart must be initialized
function _populateFromList(chart, list) {
    if (!chart || !list || !list.cells) return;
    let added = [];
    let connectionsPending = [];

    for (let i = 0; i < list.cells.length; i++) {
        let cell = list.cells[i];

        // console.log("Processing cell " + cell.title, cell);

        added.push(_renderCell(chart, cell));

        if (i > 0 && list.cells[i - 1].connectToNext) {
            chart.connect(added[i - 1], added[i]);
        }

        if (cell.multiConnect) {
            // console.log("This cell has multiple connections", cell);

            let source = cell;

            for (let c = 0; c < cell.multiConnect.length; c++) {
                // find by title
                let connection = cell.multiConnect[c];

                let node = list.cells.filter(aCell => aCell.title == connection.target);
                if (node && node.length > 0) {
                    let newConn = {
                        source: source,
                        target: node[0]
                    };
                    if (list.cells[i].multiConnect[c].breakpoints) {
                        newConn.breakpoints = list.cells[i].multiConnect[c].breakpoints;
                    }
                    connectionsPending.push(newConn);
                }
            }

        }
    }

    // console.log("Pending connections:", connectionsPending);

    for (let c = 0; c < connectionsPending.length; c++) {
        let source = chart.findCellByTitle(connectionsPending[c].source.title);
        let target = chart.findCellByTitle(connectionsPending[c].target.title);

        if (source && target) {
            // console.log("Found source and target: ", source, target);
            chart.connect(source, target, '', connectionsPending[c].breakpoints);
        } else {
            // console.log("Unable to find source or target", source, target);
        }
    }
}

// Renders a cell and all subsequent child cells to chart
function _renderCell(chart, cell, connections) {
    if (!chart || !cell) return;

    let aCell = new Chart.Cell(cell);
    chart.addCell(aCell);


    if (cell.subCells) {
        switch (cell.renderAs) {
            default:
                // console.log("Rendering a stack", aCell);

                let y = cell.position.y + aCell.cell.attributes.size.height;
                for (let i = 0; i < cell.subCells.length; i++) {
                    let subCellOptions = {
                        position: {
                            x: cell.position.x,
                            y: y
                        },
                        attrs: {
                            '.card': {
                                fill: '#22aa22'
                            }
                        }
                    };
                    let opts = cell.subCells[i];
                    opts.position = subCellOptions.position;
                    opts.attrs = joint.util.deepSupplement(subCellOptions.attrs);
                    y += chart.addCell(new Chart.Cell(opts)).cell.attributes.size.height;
                }
        }
    }
    return aCell;
}