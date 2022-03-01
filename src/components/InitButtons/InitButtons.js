import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "./styles.css";
import CustomSelect from '../CustomSelect/CustomSelect';
import BaseToken from './BaseToken';

import { uiActions, tokenActions } from '../../actions';


export default function InitButtons(props) {

    let {
        addBaseToken,
        editBaseToken,
        baseTokenCellView,
        openAddTokenToSelect,
        setOpenAddTokenToSelect,
        tokens
    } = props;

    let [openModalWindow, setOpenModalWindow] = useState(true);

    const dispatch = useDispatch();

    const addNewTokenOption = (val) => {
        let newTokenId = tokens.length;
        tokens.forEach(t => {
            if (+t.id >= newTokenId) {
                newTokenId = (+t.id) + 1;
            }
        });
        newTokenId = String(newTokenId);
        val.id = newTokenId;
        dispatch(tokenActions.postTokens(val));
    }

    return (
        <div className='hold-init-buttons'>
            <div className="init-buttons">
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
                <button onClick={() => { setOpenModalWindow(!openModalWindow) }}>Base Token</button>
            </div>
            {(openModalWindow || baseTokenCellView || openAddTokenToSelect) &&
                <BaseToken
                    addNewTokenOption={addNewTokenOption}
                    addBaseToken={addBaseToken}
                    editBaseToken={editBaseToken}
                    baseTokenCellView={baseTokenCellView}
                    setOpenModalWindow={setOpenModalWindow}
                    openAddTokenToSelect={openAddTokenToSelect}
                    setOpenAddTokenToSelect={setOpenAddTokenToSelect}
                    openMainModalWindow={props.openModalWindow}
                />}
        </div>
    )
}