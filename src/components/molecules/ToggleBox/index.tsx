import React, {useState} from 'react';

import { v4 as uuidv4 } from 'uuid'
import {ToggleTitle, WrapToggle} from "./styles";
import {CustomToggle} from "../../atoms";


export const ToggleBox = (filter)  => {
    const [isChecked, setChecked] = useState(false)

    const handleOnClick = () => {
        filter(!isChecked)
        setChecked(!isChecked)
    }

    return (
        <WrapToggle>
            <ToggleTitle>Show staked</ToggleTitle>
            <CustomToggle id={uuidv4()} onChange={handleOnClick} isChecked={isChecked} />
        </WrapToggle>
    );
}
