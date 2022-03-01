import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

import close from "../../assets/drawings/close.svg";

export default function BaseToken(props) {

    let {
        addBaseToken,
        setOpenModalWindow,
        editBaseToken,
        baseTokenCellView,
        addNewTokenOption,
        openMainModalWindow,
        openAddTokenToSelect,
        setOpenAddTokenToSelect
    } = props;

    let [tokenName, setTokenName] = useState("");
    let [tokenURL, setTokenURL] = useState("");

    useEffect(() => {
        if (baseTokenCellView) {
            setTokenName(baseTokenCellView.model.attributes.attrs.label.tokenName)
            setTokenURL(baseTokenCellView.model.attributes.attrs.label.tokenUrl)
        }
    }, [])

    return (
        <div
            className={`hold-modal base-token ${(openMainModalWindow && "move-left-window") || ""}`}
        >
            <div className='modal-options add-token-options'>
                <div className="modal-title">
                    <div>{(openAddTokenToSelect && "New Token") || "Base Token"}</div>
                    <div
                        className='title-close-button'
                        onClick={() => {
                            if (baseTokenCellView) {
                                editBaseToken(
                                    baseTokenCellView.model.attributes.attrs.label.tokenName,
                                    baseTokenCellView.model.attributes.attrs.label.tokenUrl
                                );
                            }
                            if (openAddTokenToSelect) {
                                setOpenAddTokenToSelect(false);
                            }
                            setOpenModalWindow(false);
                        }}
                    >
                        <img src={close} alt="close" />
                    </div>
                </div>

                <div className="modal-option">
                    <div className="modal-option-title">Name</div>
                    <div
                        className="hold-select-action"
                    >
                        <input
                            name="token-name"
                            // key={tokenName}
                            className='token-name-input base-token-input'
                            onChange={(e) => setTokenName(e.target.value)}
                            defaultValue={tokenName}
                            placeholder='Enter token name'
                        />
                    </div>
                </div>


                <div className="modal-option">
                    <div className="modal-option-title">Token address</div>
                    <div
                        className="hold-select-action"
                    >
                        <input
                            name="token-name"
                            // key={tokenURL}
                            className='token-name-input base-token-input'
                            onChange={(e) => setTokenURL(e.target.value)}
                            defaultValue={tokenURL}
                            placeholder='Enter token address'
                        />
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        className='add-base-token'
                        onClick={() => {
                            if (tokenName) {

                                console.log(tokenName)
                                if (baseTokenCellView) {
                                    editBaseToken(tokenName, tokenURL);
                                } else if (openAddTokenToSelect) {
                                    addNewTokenOption({ name: tokenName, url: tokenURL });
                                    setOpenAddTokenToSelect(false);
                                } else {
                                    addBaseToken(tokenName, tokenURL);
                                }
                                setOpenModalWindow(false);
                            }
                        }}
                    >{(baseTokenCellView && "Edit Base Token") || "Add Base Token"}</button>
                </div>
            </div>
        </div>
    )
}