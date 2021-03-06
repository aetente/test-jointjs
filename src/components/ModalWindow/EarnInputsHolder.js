import React, { useState, useRef, useCallback, useEffect } from 'react';
import SelectEarn from './SelectEarn';
import TokenInput from './TokenInput';
import SelectToken from './SelectToken'
import "./styles.css";

export default function EarnInputsHolder(props) {

    let { action, tokens, setOpenAddTokenToSelect, earnCell } = props;


    let linkLabel = props.activeLink && props.activeLink.label(0);
    let cellLabel = earnCell && earnCell.attributes.attrs.label;
    let tokenName = cellLabel ? cellLabel.text : "COIN";
    // let tokenName = linkLabel ? linkLabel.attrs.text.tokenName : "COIN";
    let earn = linkLabel ? linkLabel.attrs.text.earn : "None";

    let [isMinimized, setIsMinimized] = useState(true)
    let [earnValue, setEarnValue] = useState("None");
    let [tokensToSelect, setTokensToSelect] = useState([
        {
            value: "Add new...",
            callback: () => { setOpenAddTokenToSelect(true) }
        }
    ]);

    const mapTokensToSelect = (tokens) => {
        let tokensToEdit = [...tokens];
        return [...tokensToEdit.map(token => {
            return {
                img: token.designImage || token.image || "",
                value: token.name,
                id: token.id
            }
        }),
        {
            value: "Add new...",
            callback: () => { setOpenAddTokenToSelect(true) }
        }];
    }

    useEffect(() => {
        setEarnValue(earn);
        setTokensToSelect(mapTokensToSelect(tokens));
    }, [tokens])

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
                                <TokenInput earnCell={earnCell} action={action} setTokenName={props.setTokenName} activeLink={props.activeLink} />
                            }

                        </>)) || ((action[0].name === "Swap" ||
                            (action[0].name === "Supply" && (action[1] && action[1].name === "Borrow other token"))) &&
                            <SelectToken
                                earnCell={earnCell}
                                key={`select-token-${tokensToSelect.length}`}
                                action={action}
                                setTokenById={props.setTokenById}
                                activeLink={props.activeLink}
                                tokensToSelect={tokensToSelect}
                                setOpenAddTokenToSelect={setOpenAddTokenToSelect}
                            />
                        ) || (action[0].name === "Harvest" || action[0].name === "Borrow" &&
                            <>
                                <SelectEarn action={action} setEarn={updateEarn} activeLink={props.activeLink} />
                                <SelectToken
                                    earnCell={earnCell}
                                    key={`select-token-${tokensToSelect.length}`}
                                    action={action}
                                    setTokenById={props.setTokenById}
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