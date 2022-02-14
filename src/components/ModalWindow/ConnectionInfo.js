import React, { useState, useRef, useCallback, useEffect } from 'react';
import { convertObjToStr } from '../../utils/utils';
import "./styles.css";

export default function ConnectionInfo(props) {


    let {
        sourceCellsInfo,
        targetCellsInfo,
        setSourceCellsInfo,
        setTargetCellsInfo,
        tokenNamesInfo,
        graph,
        updateCounter,
        setUpdateCounter,
        activeLink
    } = props;

    let targetCellsInfoRef = useRef(targetCellsInfo);

    let getTargetCellsInfoRef = () => {
        return targetCellsInfoRef.current;
    }

    let setTargetCellsInfoRef = (val) => {
        return targetCellsInfoRef.current = val;
    }


    let sourceCellsInfoRef = useRef(sourceCellsInfo);

    let getSourceCellsInfoRef = () => {
        return sourceCellsInfoRef.current;
    }

    let setSourceCellsInfoRef = (val) => {
        return sourceCellsInfoRef.current = val;
    }



    let tokenNamesInfoRef = useRef(tokenNamesInfo);

    let getTokenNamesInfoRef = () => {
        return tokenNamesInfoRef.current;
    }

    let setTokenNamesInfoRef = (val) => {
        return tokenNamesInfoRef.current = val;
    }

    const mapCells = (cell) => {
        return cell.attributes.attrs.text.text;
    }

    const mapTokens = (cell) => {
        return cell.attributes.attrs.label.text;
    }


    const dragStart = useCallback(event => {
        if (!event.target ||
            !event.target.getAttribute ||
            !event.target.getAttribute("class") ||
            !event.target.getAttribute("class").includes("draggable")
        ) {
            event.preventDefault();
            event.stopPropagation();
            return
        };
        event.dataTransfer.setData("class", event.target.getAttribute("class"));
    }, []);

    const dragEnter = useCallback(event => {
        event.preventDefault();
    }, []);

    const dragOver = useCallback(event => {
        event.preventDefault();
    }, []);

    const dragDrop = useCallback(event => {
        // here we swap places for "from" and "to" cells (for now only if one cell)
        event.preventDefault();
        let dragClass = event.dataTransfer.getData('class');
        let targetClass = event.target.getAttribute("class");
        if (!dragClass || !targetClass) return;


        let sourceCellsArray = getSourceCellsInfoRef();
        let targetCellsArray = getTargetCellsInfoRef();
        let targetCell = null;
        let sourceCell = null;
        let tokenCell = getTokenNamesInfoRef()[0];

        let theLinks = graph.getLinks();
        if ((targetClass.includes('info-from') && dragClass.includes('info-to')) ||
            (dragClass.includes('info-from') && targetClass.includes('info-to'))) {
            // sourceCell = sourceCellsArray[0];
            // targetCell = targetCellsArray[0];


            // let toLink = null;
            // let fromLink = null;


            // // let sourcePort = sourceCell.getPort(activeLink.attributes.source.port);
            // let sourceCellPort = null;
            // let targetCellPort = null;
            // let tokenInPort = null;
            // let tokenOutPort = null;

            // theLinks.forEach(link => {
            //     let linkSourceCell = link.getSourceCell();
            //     let linkTargetCell = link.getTargetCell();

            //     if (linkSourceCell.id === sourceCell.id && linkTargetCell.id === tokenCell.id) {
            //         sourceCellPort = sourceCell.getPort(link.attributes.source.port);
            //         tokenInPort = tokenCell.getPort(link.attributes.target.port);
            //         fromLink = link;
            //     } else if (linkSourceCell.id === tokenCell.id && linkTargetCell.id === targetCell.id) {
            //         tokenOutPort = tokenCell.getPort(link.attributes.source.port);
            //         targetCellPort = targetCell.getPort(link.attributes.target.port);
            //         toLink = link;
            //     }
            // });

            // let sourceCellId = sourceCell.id;
            // let targetCellId = targetCell.id;
            // let tokenCellId = tokenCell.id;

            // let sourceCellPortId = sourceCellPort.id;
            // let targetCellPortId = targetCellPort.id;
            // let tokenInPortId = tokenInPort.id;
            // let tokenOutPortId = tokenOutPort.id;
            // if (toLink && fromLink) {
            //     // toLink.source({ id: sourceCellId, port: sourceCellPortId });
            //     // toLink.target({ id: tokenCellId, port: tokenInPortId });

            //     // fromLink.source({ id: tokenCellId, port: tokenOutPortId });
            //     // fromLink.target({ id: targetCellId, port: targetCellPortId });

            //     // toLink.source({ id: tokenCellId, port: tokenOutPortId });
            //     // toLink.target({ id: sourceCellId, port: sourceCellPortId });

            //     // fromLink.source({ id: targetCellId, port: targetCellPortId });
            //     // fromLink.target({ id: tokenCellId, port: tokenInPortId });


            //     activeLink.source({ id: tokenCellId, port: tokenOutPortId });
            //     activeLink.target({ id: sourceCellId, port: sourceCellPortId });

            //     setSourceCellsInfo(targetCellsArray);
            //     setTargetCellsInfo(sourceCellsArray);
            //     // force update the modal window
            //     // TODO find better way to update it
            //     setUpdateCounter(updateCounter + 1);
            // }

            if (activeLink && activeLink.isLink()) {
                // activeLink.vertices([])
                let targetCell = activeLink.getTargetCell();
                let sourceCell = activeLink.getSourceCell();
                // console.log(targetCell, sourceCell)
                if (targetCell && sourceCell) {
                    let targetCellType = convertObjToStr(targetCell.attributes.typeOfCell);
                    let sourceCellType = convertObjToStr(sourceCell.attributes.typeOfCell);
                    let sourcePort = sourceCell.getPort(activeLink.attributes.source.port);
                    let targetPort = targetCell.getPort(activeLink.attributes.target.port);
                    let sourcePortPosition = sourcePort.group;
                    let targetPortPosition = targetPort.group;
                    // if (sourcePortPosition === "top" && targetPortPosition === "bottom") {
                    let sourceCellsNeighbors = graph.getNeighbors(sourceCell)
                    // if (targetPortPosition === "bottom") {
                    let isNewCell = sourceCellsNeighbors.length <= 1;
                    let isConnectionBetweenEarns = sourceCellType === "earn_cell" && targetCellType === "base_token";

                    activeLink.target({ id: sourceCell.id, port: sourcePort.id })
                    activeLink.source({ id: targetCell.id, port: targetPort.id })
                    setUpdateCounter(updateCounter + 1);
                }
            }

        }

    }, []);

    useEffect(() => {
        setTargetCellsInfoRef(targetCellsInfo);
        setSourceCellsInfoRef(sourceCellsInfo);
        setTokenNamesInfoRef(tokenNamesInfo);
        window.addEventListener("dragstart", dragStart);
        window.addEventListener("dragenter", dragEnter);
        window.addEventListener("dragover", dragOver);
        window.addEventListener("drop", dragDrop);

        return () => {
            window.removeEventListener("dragstart", dragStart);
            window.removeEventListener("dragenter", dragEnter);
            window.removeEventListener("dragover", dragOver);
            window.removeEventListener("drop", dragDrop);
        };
    }, [targetCellsInfo, sourceCellsInfo])

    return (

        <div className="modal-option cells-info-wrapper">
            <div className='cells-info-row'>
                <div>Token:</div>
                <div>{tokenNamesInfo.map(mapTokens).join(", ")}</div>
            </div>
            <div draggable className='cells-info-row info-from draggable'>
                <div>From:</div>
                <div className='info-from'>{sourceCellsInfo.map(mapCells).join(", ")}</div>
            </div>
            <div draggable className='cells-info-row  info-to  draggable'>
                <div>To:</div>
                <div className='info-to'>{targetCellsInfo.map(mapCells).join(", ")}</div>
            </div>
        </div>
    )
}