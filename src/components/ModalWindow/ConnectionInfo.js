import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function ConnectionInfo(props) {


    let { sourceCellsInfo, targetCellsInfo, tokenNamesInfo } = props;

    const mapCells = (cell) => {
        return cell.attributes.attrs.text.text;
    }

    const mapTokens = (cell) => {
        return cell.attributes.attrs.label.text;
    }

    return (

        <div className="modal-option cells-info-wrapper">
            <div className='cells-info-row'>
                <div>Token:</div>
                <div>{tokenNamesInfo.map(mapTokens).join(", ")}</div>
            </div>
            <div className='cells-info-row'>
                <div>From:</div>
                <div>{sourceCellsInfo.map(mapCells).join(", ")}</div>
            </div>
            <div className='cells-info-row'>
                <div>To:</div>
                <div>{targetCellsInfo.map(mapCells).join(", ")}</div>
            </div>
        </div>
    )
}