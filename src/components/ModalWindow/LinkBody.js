import React from "react";
import ConnectionInfo from "./ConnectionInfo";
import AllocationInput from "./AllocationInput";
import SelectAction from "./SelectAction";
import LeverageInput from "./LeverageInput";

import close from "../../assets/drawings/close.svg";

export default function LinkBody(props) {

    let {
        modalScrollRef,
        setOpenModalWindow,
        sourceCellsInfo,
        targetCellsInfo,
        tokenNamesInfo,
        setSourceCellsInfo,
        setTargetCellsInfo,
        graph,
        updateCounter,
        setUpdateCounter,
        activeLink,
        scrollInput,
        actionLink,
        setAction,
        action,
        updateEarnLinks,
        mapEarnOptions,
        earnLinks
    } = props;

    return (
        <div ref={modalScrollRef} className='modal-options'>
            <div className="modal-title">
                <div>Set an action</div>
                <div
                    className='title-close-button'
                    onClick={() => {
                        setOpenModalWindow(false);
                    }}
                >
                    <img src={close} alt="close" />
                </div>
            </div>
            <ConnectionInfo
                sourceCellsInfo={sourceCellsInfo}
                targetCellsInfo={targetCellsInfo}
                tokenNamesInfo={tokenNamesInfo}
                setSourceCellsInfo={setSourceCellsInfo}
                setTargetCellsInfo={setTargetCellsInfo}
                graph={graph}
                updateCounter={updateCounter}
                setUpdateCounter={setUpdateCounter}
                activeLink={activeLink}
            />
            <AllocationInput
                scrollInput={scrollInput}
                key={actionLink}
                actionIndex={0}
                setAction={setAction}
                activeLink={actionLink}
            />
            <SelectAction
                scrollInput={scrollInput}
                key={`select-action-${updateCounter}-0`}
                actionIndex={0}
                setAction={setAction}
                activeLink={actionLink}
            />
            {action.length > 0 && action[0].name === "Supply" && (
                <>
                    <SelectAction
                        scrollInput={scrollInput}
                        key={`select-action-${updateCounter}-1`}
                        isSupply
                        actionIndex={1}
                        setAction={setAction}
                        updateEarnLinks={updateEarnLinks}
                        activeLink={actionLink}
                    />
                    {action.length > 1 && action[1].name !== "No borrow" &&
                        <AllocationInput
                            scrollInput={scrollInput}
                            key={actionLink}
                            actionIndex={1}
                            setAction={setAction}
                            activeLink={actionLink}
                        />
                    }
                    {action.length > 1 && action[1].name === "Borrow the same token" &&
                        <LeverageInput
                            scrollInput={scrollInput}
                            key={`leverage-input`}
                            actionIndex={1}
                            setAction={setAction}
                            activeLink={actionLink}
                        />
                    }
                </>
            )}
            {mapEarnOptions(earnLinks, action)}
        </div>)
}