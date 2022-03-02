import React, { useEffect, useState } from "react";

import CustomSelect from "../CustomSelect/CustomSelect";

import close from "../../assets/drawings/close.svg";

import poligonImage from "../../assets/images/network-poligon.png";
import maticImage from "../../assets/images/network-matic.png";
import binanceImage from "../../assets/images/network-binance.png";

const networkOptions = [
    {
        value: "Poligon",
        image: poligonImage
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
        value: "Binance",
        image: binanceImage
    },
    {
        value: "Matic",
        image: maticImage
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
        // let defaultValues = activeBridge
        let defaultFrom = activeBridge.from && {value: activeBridge.from} || networkOptions[0];
        let defaultTo = activeBridge.to && {value: activeBridge.to} || networkOptions[0];
        setFromNetwork(defaultFrom);
        setToNetwork(defaultTo);
    }, [activeBridge])

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
                    key={`from-networks-${fromNetwork && fromNetwork.value}`}
                    className='select-actions'
                    onChange={e => {
                        setFromNetwork(e)
                    }}
                    defaultValue={fromNetwork && fromNetwork.value}
                    options={networkOptions}
                />
            </div>

            <div className="modal-option">
                <div className="modal-option-title">To:</div>
                <CustomSelect
                    additionalClass="token-select"
                    name="actions"
                    key={`to-networks-${toNetwork && toNetwork.value}`}
                    className='select-actions'
                    onChange={e => {
                        setToNetwork(e)
                    }}
                    defaultValue={toNetwork && toNetwork.value}
                    options={networkOptions}
                />
            </div>
        </div>
    )
}