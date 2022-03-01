import React, { useState, useRef, useCallback, useEffect } from 'react';
import CustomSelect from '../CustomSelect/CustomSelect';
import "./styles.css";



export default function SelectToken(props) {

    let {action, tokensToSelect, earnCell} = props;
    
    // let linkLabel = props.activeLink && props.activeLink.label(0);
    // let linkLabel = props.activeLink && props.activeLink.label(0);
    // let defaultSelectValue = linkLabel ? linkLabel.attrs.text.tokenName : tokensToSelect[0].value;
    let cellLabel = earnCell && earnCell.attributes.attrs.label;
    let cellTextFromAttributes = earnCell && earnCell.attributes.tokenText;
    let defaultSelectValue = (cellLabel && cellLabel.text && cellLabel.text !== "") ?
        cellLabel.text :
        cellTextFromAttributes || (tokensToSelect[0] && tokensToSelect[0].value || "");

    useEffect(() => {
        let cellLabel = earnCell && earnCell.attributes.attrs.label;
        let cellTextFromAttributes = earnCell && earnCell.attributes.tokenText;
        let defaultSelectValue = (cellLabel && cellLabel.text && cellLabel.text !== "") ?
            cellLabel.text :
            cellTextFromAttributes || (tokensToSelect[0] && tokensToSelect[0].value || "");
        props.setTokenById(defaultSelectValue.id);
    }, [tokensToSelect])

    return (
        <div className="modal-option">
            {(action[0].name === "Swap" && <>
                <div className="modal-option-title header-title">To</div>
                <div className="modal-option-title">Token</div>
            </>) || ( <div className="modal-option-title">In what Token</div>)}
            <div
                className="hold-select-action"
            >
                <CustomSelect
                    additionalClass="token-select"
                    name="actions"
                    key={defaultSelectValue.id}
                    className='select-actions'
                    onChange={e => {
                        props.setTokenById(e.id)
                    }}
                    defaultValue={defaultSelectValue}
                    options={tokensToSelect}
                />
            </div>
        </div>
    )
}