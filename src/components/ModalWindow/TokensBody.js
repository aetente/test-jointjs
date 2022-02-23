import React from "react";
import ProtocolNameInput from "./ProtocolNameInput";
import ProtocolUrlInput from "./ProtocolUrlInput";
import ProtocolColorPicker from "./ProtocolColorPicker";

import close from "../../assets/drawings/close.svg";

export default function TokensBody(props) {

    let {
        modalScrollRef,
        setOpenModalWindow,
        activeToken,
        tokens,
        tokenCells,
        setActiveToken,
        updateTokens,
        isMerge,
        setIsMerge,
        parentUpdateCount,
        setParentUpdateCount
    } = props;

    return (
        <div ref={modalScrollRef} className='modal-options'>
            <div className="modal-title">
                <div>{
                    (isMerge && "Merge token") ||
                    (activeToken.id && "Edit the token") ||
                    "Add a new token"
                }</div>
                <div
                    className='title-close-button'
                    onClick={() => {
                        // check if the protocol which is being edited already exists
                        let tokenIndex = tokens.findIndex((token) => {
                            return token.id === activeToken.id;
                        });
                        // if not, it means that we should delete the cell from the paper
                        // when we press close button, but not "done" button
                        if (tokenCells && tokenIndex < 0) {
                            tokenCells.forEach(tCell => {
                                // remove only cells with no names for now
                                // TODO change logic
                                if (tCell.attributes.attrs.label.text === "") {
                                    tCell.remove();
                                }
                            });
                        } else if (!tokenCells) {
                            setParentUpdateCount(parentUpdateCount + 1);
                        }
                        setIsMerge(false);
                        setOpenModalWindow(false);
                    }}
                >
                    <img src={close} alt="close" />
                </div>
            </div>
            <ProtocolNameInput
                activeProtocol={activeToken}
                setActiveProtocol={setActiveToken}
                updateProtocols={updateTokens}
            />
            <ProtocolUrlInput
                activeProtocol={activeToken}
                setActiveProtocol={setActiveToken}
                updateProtocols={updateTokens}
            />
            <ProtocolColorPicker
                activeProtocol={activeToken}
                setActiveProtocol={setActiveToken}
                updateProtocols={updateTokens}
            />
        </div>
    )
}