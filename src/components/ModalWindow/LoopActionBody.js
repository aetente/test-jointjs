import React from "react";
import LeverageInput from "./LeverageInput";

import close from "../../assets/drawings/close.svg";

export default function LoopActionBody(props) {

    let {
        modalScrollRef,
        setOpenModalWindow,
        scrollInput,
        setAction,
        actionLink
    } = props;

    return (
        <div ref={modalScrollRef} className='modal-options'>
            <div className="modal-title">
                <div>Set an leverage/repeat</div>
                <div
                    className='title-close-button'
                    onClick={() => {
                        setOpenModalWindow(false);
                    }}
                >
                    <img src={close} alt="close" />
                </div>
            </div>
            <LeverageInput
                scrollInput={scrollInput}
                key={`leverage-input`}
                actionIndex={1}
                setAction={setAction}
                activeLink={actionLink}
            />
        </div>
    )
}