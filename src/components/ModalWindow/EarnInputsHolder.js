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
    let [earnValue, setEarnValue] = useState("None");

    useEffect(() => {
        setEarnValue(earn);
    }, [])

    const updateEarn = (val) => {
        setEarnValue(val);
        props.setEarn(val);
    }

    return (

        <div>
            {
                (isMinimized && earn !== "None" && props.arrayLength > 1 &&
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
                            {(earn === "Trading fee" && (
                                <>
                                    Earn <span>{earn}</span>
                                </>
                            )) || (<>
                                Earn <span>{earn}</span> with <span>{tokenName}</span>
                            </>)}
                        </div>
                    </div>)
                ||
                <>
                    {(action[0].name === "Stake" &&
                        (<>
                            <SelectEarn action={action} setEarn={updateEarn} activeLink={props.activeLink} />
                            {earnValue !== "Trading fee" &&
                                <TokenInput action={action} setTokenName={props.setTokenName} activeLink={props.activeLink} />
                            }

                        </>)) || ((action[0].name === "Swap" ||
                                (action[0].name === "Supply" && (action[1] && action[1].name === "Borrow other token"))) &&
                            <SelectToken
                                key={`select-token-${tokensToSelect.length}`}
                                action={action}
                                setTokenName={props.setTokenName}
                                activeLink={props.activeLink}
                                tokensToSelect={tokensToSelect}
                                setOpenAddTokenToSelect={setOpenAddTokenToSelect}
                            />
                        ) || (action[0].name === "Harvest" || action[0].name === "Borrow" &&
                            <>
                                <SelectEarn action={action} setEarn={updateEarn} activeLink={props.activeLink} />
                                <SelectToken
                                    key={`select-token-${tokensToSelect.length}`}
                                    action={action}
                                    setTokenName={props.setTokenName}
                                    activeLink={props.activeLink}
                                    tokensToSelect={tokensToSelect}
                                    setOpenAddTokenToSelect={setOpenAddTokenToSelect}
                                />
                            </>
                        )
                    }
                </>
            }
        </div>
    )
}