import React, { useState, useEffect } from "react";
import ModalWindow from "../ModalWindow/ModalWindow";
import "./styles.css";

import { listToMatrix } from "../../utils/utils";

function SelectCells(props) {

    let { protocols, tokens } = props;

    const [filterString, setFilterString] = useState("");
    const [isOpenAllProtocols, setIsOpenAllProtocols] = useState(true);
    const [isOpenAllTokens, setIsOpenAllTokens] = useState(true);

    const [openModalWindow, setOpenModalWindow] = useState(false);

    const [isSelectOpen, setIsSelectOpen] = useState(true);

    const [activeToken, setActiveToken] = useState(null);
    const [activeProtocol, setActiveProtocol] = useState(null);

    const [stateProtocols, setStateProtocols] = useState(protocols);
    const [stateTokens, setStateTokens] = useState(tokens);

    // TODO probably not the best way to update parent component
    const [updateCount, setUpdateCount] = useState(0);

    const handleProtocolClick = (protocol) => {
        let theCellProtocol = {}
        theCellProtocol.id = protocol.id;
        theCellProtocol.name = protocol.name;
        theCellProtocol.url = protocol.url;
        theCellProtocol.backgroundColor = protocol.backgroundColor;
        theCellProtocol.borderColor = protocol.borderColor;
        theCellProtocol.image = protocol.image;
        setActiveProtocol(theCellProtocol);
        setActiveToken(null);
        setOpenModalWindow(true);
    }

    const handleTokenClick = (token) => {
        let theCellToken = {}
        theCellToken.id = token.id;
        theCellToken.name = token.name;
        theCellToken.url = token.url;
        theCellToken.backgroundColor = token.backgroundColor;
        theCellToken.borderColor = token.borderColor;
        theCellToken.image = token.image;
        setActiveToken(theCellToken);
        setActiveProtocol(null);
        setOpenModalWindow(true);
    }

    const mapProtocols = (protocols) => {
        protocols = protocols.filter((protocol) => {
            return protocol && protocol.name.toLowerCase().includes(filterString.toLowerCase());
        }).reverse();
        protocols = listToMatrix(protocols, 2);
        if (protocols[protocols.length - 1].length === 1) {
            protocols[protocols.length - 1].push({ addNew: true })
        } else {
            protocols.push([{ addNew: true }])
        }
        return (<div className={`mapped-menu-options design-mapped-menu-options`}>

            {protocols.map((pRow, i) => {
                return (
                    <div key={`list-row-${i}`} className={`list-row`}>
                        {pRow.map(p => {
                            if (p.addNew) {
                                return (
                                    <div
                                        onClick={() => {
                                            let mockProtocol = {
                                                name: "",
                                                url: "",
                                                id: stateProtocols.length
                                            }
                                            setStateProtocols(protocols => [...protocols, mockProtocol])
                                            handleProtocolClick(mockProtocol)
                                        }}
                                        key={"protocol-add-new"}
                                        className="hold-menu-option"
                                    >
                                        + add new
                                    </div>
                                )
                            }
                            return (
                                <div
                                    onClick={() => { handleProtocolClick(p) }}
                                    key={p.id}
                                    className="hold-menu-option"
                                >
                                    <div
                                        className="draggable protocol"
                                        style={{
                                            backgroundColor: p.backgroundColor,
                                            border: `2px solid ${p.borderColor}`
                                        }}
                                    >
                                        {p.image && p.image !== "null" && <div className="menu-option-content">
                                            <img draggable={false} src={p.image} alt={p.name} />
                                        </div>}
                                    </div>
                                    <div
                                        className="menu-option-title"
                                    >
                                        {p.name}
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </div>)
            })}
        </div>);
    }

    const mapTokens = (tokens) => {
        tokens = tokens.filter((token) => {
            return token && token.name.toLowerCase().includes(filterString.toLowerCase());
        }).reverse();
        tokens = listToMatrix(tokens, 2);
        if (tokens[tokens.length - 1].length === 1) {
            tokens[tokens.length - 1].push({ addNew: true })
        } else {
            tokens.push([{ addNew: true }])
        }
        return (<div className={`mapped-menu-options design-mapped-menu-options`}>

            {tokens.map((tRow, i) => {
                return (
                    <div key={`list-row-${i}`} className={`list-row`}>
                        {tRow.map(t => {
                            if (t.addNew) {
                                return (
                                    <div
                                        onClick={() => {
                                            let mockToken = {
                                                name: "",
                                                url: "",
                                                id: stateTokens.length
                                            }
                                            setStateTokens(tokens => [...tokens, mockToken])
                                            handleTokenClick(mockToken)
                                        }}
                                        key={"protocol-add-new"}
                                        className="hold-menu-option"
                                    >
                                        + add new
                                    </div>
                                )
                            }
                            return (
                                <div
                                    onClick={() => { handleTokenClick(t) }}
                                    key={t.id}
                                    className="hold-menu-option hold-token-option"
                                >
                                    <div
                                        className="draggable select-token"
                                    >
                                        {t.image && t.image !== "null" && <div className="menu-option-content no-transform">
                                            <img draggable={false} src={t.image} alt={t.name} />
                                        </div>}
                                    </div>
                                    <div
                                        className="menu-option-title"
                                    >
                                        {t.name}
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </div>)
            })}
        </div>);
    }


    useEffect(() => {
        setStateProtocols(protocols);
        setStateTokens(tokens);
        return () => {
        };
    }, [protocols, tokens, updateCount])

    return (
        <div className={`hold-cells design-cells`} style={{
            height: window.innerHeight - 20,
            minWidth: `${window.innerWidth - 20}px`
        }} >
            <div className="design-options">
                <div>New protocols</div>
                {mapProtocols(stateProtocols)}
            </div>
            <div className="design-options">
                <div>New tokens</div>
                {mapTokens(stateTokens)}
            </div>
            {openModalWindow && (activeProtocol || activeToken) &&
                <ModalWindow
                    key={(activeProtocol && `protocol-${activeProtocol.id}`) ||
                        (activeToken && `token-${activeToken.id}`)}
                    setOpenModalWindow={setOpenModalWindow}
                    activeProtocol={activeProtocol}
                    activeToken={activeToken}
                    setActiveLink={() => { }}
                    stackGraph={() => { }}
                    setActiveProtocol={setActiveProtocol}
                    setActiveToken={setActiveToken}
                    protocols={protocols}
                    tokens={tokens}
                    setProtocols={() => { }}
                    setActiveLoopAction={() => { }}
                    setProtocolCells={() => { }}
                    setTokenCells={() => { }}
                    setIsMerge={() => { }}
                    stateProtocols={stateProtocols}
                    setStateProtocols={setStateProtocols}
                    stateTokens={stateTokens}
                    setStateTokens={setStateTokens}
                    isDesign={true}
                    parentUpdateCount={updateCount}
                    setParentUpdateCount={setUpdateCount}
                />
            }
        </div>
    );
    // }
}

export default SelectCells;
