import React, {useState} from 'react';

import { v4 as uuidv4 } from 'uuid'
import {ToggleTitle, WrapToggle} from "./styles";
import {CustomToggle} from "../../atoms";

export const ToggleBox = ({title = 'Show staked', setStaked}: any)  => {
    const [isChecked, setChecked] = useState(false)

    const handleOnClick = () => {
        setStaked(!isChecked)
        setChecked(!isChecked)
    }

    return (
        <WrapToggle>
            <ToggleTitle>{title}</ToggleTitle>
            <CustomToggle id={uuidv4()} onChange={handleOnClick} isChecked={isChecked} />
        </WrapToggle>
    );
}
