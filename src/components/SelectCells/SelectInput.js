import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

import iconSearch from "../../assets/drawings/icon-search.svg";
import iconBurger from "../../assets/drawings/icon-burger.svg";
import iconGrid from "../../assets/drawings/icon-grid.svg";

export default function SelectInput(props) {

    return (
        <div className='hold-input-tools'>
            <div className='hold-input'>
                <div>
                    <img src={iconSearch} alt="" />
                </div>
                <input
                    onChange={(e) => {
                        props.setFilterString(e.target.value)
                    }}
                    className="protocol-search"
                    placeholder="Search"
                />
            </div>
            <div className='hold-tools'>
                <div className='input-tool'>
                    <img src={iconBurger} alt="" />
                </div>
                <div className='input-tool'>
                    <img src={iconGrid} alt="" />
                </div>
            </div>
        </div>
    )
}