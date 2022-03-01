import React, { useEffect, useState } from "react";

import CustomSelect from "../CustomSelect/CustomSelect";

import close from "../../assets/drawings/close.svg";

const networkOptions = [
    {
        value: "Polygon"
    },
    {
        value: "Etherium"
    },
    {
        value: "Polkadot"
    },
    {
        value: "Solana"
    },
    {
        value: "BSC"
    },
    {
        value: "Network"
    }
]

export default function BridgeBody(props) {

    let {
        modalScrollRef,
        setOpenModalWindow,
        activeBridge,
        setActiveBridge,
        toNetwork,
        fromNetwork,
        setToNetwork,
        setFromNetwork
    } = props;

    useEffect(() => {
        setFromNetwork(networkOptions[0].value);
        setToNetwork(networkOptions[0].value);
    }, [])

    return (
        <div ref={modalScrollRef} className='modal-options'>
            <div className="modal-title">
                <div>{
                    "Bridge"
                }</div>
                <div
                    className='title-close-button'
                    onClick={() => {
                        setOpenModalWindow(false);
                    }}
                >
                    <img src={close} alt="close" />
                </div>
            </div>
            <div className="modal-option">
                <div className="modal-option-title">From:</div>
                <CustomSelect
                    additionalClass="token-select"
                    name="actions"
                    key={"from-networks"}
                    className='select-actions'
                    onChange={e => {
                        setFromNetwork(e.value)
                    }}
                    defaultValue={fromNetwork}
                    options={networkOptions}
                />
            </div>

            <div className="modal-option">
                <div className="modal-option-title">To:</div>
                <CustomSelect
                    additionalClass="token-select"
                    name="actions"
                    key={"to-networks"}
                    className='select-actions'
                    onChange={e => {
                        setToNetwork(e.value)
                    }}
                    defaultValue={toNetwork}
                    options={networkOptions}
                />
            </div>
        </div>
    )
}