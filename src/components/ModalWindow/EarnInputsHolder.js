import React, { useState, useRef, useCallback, useEffect } from 'react';
import SelectEarn from './SelectEarn';
import TokenInput from './TokenInput';
import SelectToken from './SelectToken'
import "./styles.css";

export default function EarnInputsHolder(props) {

    let { action, tokensToSelect, setOpenAddTokenToSelect } = props;

    let linkLabel = props.activeLink && props.activeLink.label(0);
    let tokenName = linkLabel ? linkLabel.attrs.text.tokenName : "COIN";
    let earn = linkLabel ? linkLabel.attrs.text.earn : "None";

    let [isMinimized, setIsMinimized] = useState(true)

    return (

        <div>
            {
                isMinimized && earn !== "None" && props.arrayLength > 1 &&
                <div className='hold-minimized'>
                    <div className='minimized-title'>
                        <div className='minimized-title-counter'>
                            {props.i + 1} Selection
                        </div>
                        <div
                            className='unminimize'
                            onClick={() => {
                                setIsMinimized(!isMinimized)
                            }}
                        >
                            Edit
                        </div>
                    </div>

                    <div className='minimized-description'>
                        Earn <span>{earn}</span> with <span>{tokenName}</span>
                    </div>
                </div>
                ||
                <>
                    {(action[0] === "Stake" &&
                        (<>
                            <SelectEarn setEarn={props.setEarn} activeLink={props.activeLink} />
                            <TokenInput action={action} setTokenName={props.setTokenName} activeLink={props.activeLink} />
                        </>)) || (
                            <SelectToken
                                action={action}
                                setTokenName={props.setTokenName}
                                activeLink={props.activeLink}
                                tokensToSelect={tokensToSelect}
                                setOpenAddTokenToSelect={setOpenAddTokenToSelect}
                            />
                        )
                    }
                </>
            }
        </div>
    )
}