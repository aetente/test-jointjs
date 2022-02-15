import React, { useState, useRef, useCallback, useEffect } from 'react';
import { convertObjToStr } from '../../utils/utils';
import "./styles.css";



export default function SelectAction(props) {

    let { isSupply } = props;

    let actionIndex = props.actionIndex;
    let linkLabel = props.activeLink && props.activeLink.label(actionIndex);
    let defaultSelectValue = linkLabel ? linkLabel.attrs.text.action : "Stake";

    let [typeOfConnection, setTypeOfConnection] = useState(null);

    useEffect(() => {
        if (props.activeLink) {
            let targetCell = props.activeLink.getTargetCell();
            let sourceCell = props.activeLink.getSourceCell();
            let targetCellType = convertObjToStr(targetCell.attributes.typeOfCell);
            let sourceCellType = convertObjToStr(sourceCell.attributes.typeOfCell);

            // let theTypeOfConnection = ((
            //     (sourceCellType === "earn_cell" && targetCellType === "earn_cell") ||
            //     (sourceCellType === "earn_cell" && targetCellType === "base_token") ||
            //     (targetCellType === "earn_cell" && sourceCellType === "base_token")) && "Re-invest") || null;

            let theTypeOfConnection = ((
                (targetCellType === "earn_cell") ||
                (targetCellType === "base_token")) && "Re-invest") || null;
            if (isSupply) {
                theTypeOfConnection = "Supply";
            }
            setTypeOfConnection(theTypeOfConnection);

        }
    }, [props.activeLink])

    return (
        <div className="modal-option">
            <div className="modal-option-title">Choose action {(isSupply && "2") || ""}</div>
            <div
                className="hold-select-action"
            >
                <select
                    name="actions"
                    key={defaultSelectValue}
                    className='select-actions'
                    onChange={e => {
                        props.setAction(actionValue => {
                            if (!actionValue[actionIndex]) {
                                actionValue.push({ name: e.target.value });
                            } else {
                                if (e.target.value !== "No borrow") {
                                    actionValue.splice(actionIndex, 1, { ...actionValue[actionIndex], name: e.target.value });
                                }
                            }
                            return [...actionValue];
                        });
                        // props.setAction(actionValue => [...actionValue.splice(actionIndex, 1, e.target.value)]);
                    }}
                    defaultValue={defaultSelectValue}
                >
                    {(typeOfConnection === "Re-invest" &&
                        (
                            <option value="Re-invest">Re-invest</option>
                        ))
                        || (typeOfConnection === "Supply" && (<>
                            <option value="No borrow">No borrow</option>
                            <option value="Borrow">Borrow</option>
                        </>)) || (<>
                            <option value="Stake">Stake</option>
                            <option value="Swap">Swap</option>
                            <option value="Claim">Claim</option>
                            <option value="Supply">Supply</option>
                            <option value="Borrow">Borrow</option>
                            <option value="Harvest">Harvest</option>
                            <option value="Re-invest">Re-invest</option>
                        </>)
                    }
                </select>
            </div>
        </div>
    )
}