import React from 'react'

import {SwapButton} from "../../atoms";
import {StyledApprovalButton} from "./styles";


export const ApprovalButton = ({isVisible, title, amount, contractHash, callIncreaseAllowance} : any) => {
    
    return (
        isVisible &&
        <StyledApprovalButton>
            <SwapButton content={title} disabled={amount <= 0} handler={async () => { callIncreaseAllowance(amount, contractHash)}} />
        </StyledApprovalButton>
    );
}
