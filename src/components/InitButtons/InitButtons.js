import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";
import CustomSelect from '../CustomSelect/CustomSelect';
import ArrowDown from "./ArrowDown.svg";
import BaseToken from './BaseToken';



export default function InitButtons(props) {

    let { addBaseToken, editBaseToken, baseTokenCellView } = props;

    let [openModalWindow, setOpenModalWindow] = useState(false);

    return (
        <div className='hold-init-buttons'>
            <div className="init-buttons">
                {/* <div className='select-wrapper'> */}
                <CustomSelect
                    options={[
                        {
                            value: "Networks",
                            hidden: true
                        },
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
                    ]}
                />
                {/* <select
                    className='network-select'
                    onClick={() => {
                        if (openModalWindow) {
                            setOpenModalWindow(false);
                        }
                    }}
                    style={{
                        backgroundImage: `url(${ArrowDown}) !important`,
                        // background: `url(${ArrowDown}) linear-gradient(146.14deg, #35424B 0%, #0B0E12 100%) !important`,
                        // background: `url(${ArrowDown}) linear-gradient(146.14deg, #35424B 0%, #0B0E12 100%) no-repeat calc(100% - 10px) !important`
                    }}
                    defaultValue="Networks"
                >
                    <option value="Networks" hidden>Networks</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Etherium">Etherium</option>
                    <option value="Polkadot">Polkadot</option>
                    <option value="Solana">Solana</option>
                    <option value="BSC">BSC</option>
                    <option value="Network">Network</option>
                </select> */}
                {/* </div> */}
                <button onClick={() => { setOpenModalWindow(!openModalWindow) }}>Base Token</button>
            </div>
            {(openModalWindow || baseTokenCellView) && <BaseToken
                addBaseToken={addBaseToken}
                editBaseToken={editBaseToken}
                baseTokenCellView={baseTokenCellView}
                setOpenModalWindow={setOpenModalWindow}
            />}
        </div>
    )
}