import React from "react";
import ProtocolColorPicker from "./ProtocolColorPicker";
import ProtocolNameInput from "./ProtocolNameInput";
import ProtocolPoolInput from "./ProtocolPoolInput";
import ProtocolUrlInput from "./ProtocolUrlInput";

import close from "../../assets/drawings/close.svg";

export default function ProtocolsBody(props) {

    let {
        modalScrollRef,
        setOpenModalWindow,
        activeProtocol,
        protocols,
        protocolCells,
        setActiveProtocol,
        updateProtocols
    } = props;

    return (
        <div ref={modalScrollRef} className='modal-options'>
            <div className="modal-title">
                <div>{(activeProtocol.id && "Edit the protocol") || "Add a new protocol"}</div>
                <div
                    className='title-close-button'
                    onClick={() => {
                        // check if the protocol which is being edited already exists
                        let protocolIndex = protocols.findIndex((protocol) => {
                            return protocol.id === activeProtocol.id;
                        });
                        // if not, it means that we should delete the cell from the paper
                        // when we press close button, but not "done" button
                        if (protocolIndex < 0) {
                            protocolCells.forEach(pCell => {
                                pCell.remove();
                            });
                        }
                        setOpenModalWindow(false);
                    }}
                >
                    <img src={close} alt="close" />
                </div>
            </div>
            <ProtocolNameInput
                activeProtocol={activeProtocol}
                setActiveProtocol={setActiveProtocol}
                updateProtocols={updateProtocols}
            />
            <ProtocolUrlInput
                activeProtocol={activeProtocol}
                setActiveProtocol={setActiveProtocol}
                updateProtocols={updateProtocols}
            />
            <ProtocolPoolInput
                activeProtocol={activeProtocol}
                setActiveProtocol={setActiveProtocol}
                updateProtocols={updateProtocols}
            />
            <ProtocolColorPicker
                activeProtocol={activeProtocol}
                setActiveProtocol={setActiveProtocol}
                updateProtocols={updateProtocols}
            />
        </div>
    )
}