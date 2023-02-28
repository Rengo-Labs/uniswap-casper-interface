import React from "react"
import ProgressImg from '../../../assets/newIcons/success.png'
import {
    OverlayPopup,
    PopupBottom,
    PopupClose,
    PopupContainer,
    PopupContent,
    PopupTitle,
    LDSRing,
} from "./styles"
import {Button} from "../../atoms"

export const PopupsModule = ({isOpen, handleOpen, progress, children}: any) => {
    const closeHandler = () => {
        handleOpen(!isOpen)
    }

    return (
        <OverlayPopup isOpen={isOpen}>
            <PopupContainer>
                <PopupTitle>Processing...</PopupTitle>
                <PopupClose onClick={closeHandler}>&times;</PopupClose>
                {
                    progress && (<LDSRing>
                        <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </LDSRing>)
                }
                {
                    !progress && (<LDSRing>
                        <img src={ProgressImg} />
                    </LDSRing>)
                }
                <PopupContent>
                  {children}
                </PopupContent>
                <PopupBottom>
                    {/* TODO: remove inline css*/}
                    <Button style={{fontSize: "16px", backgroundColor: "transparent", width: "50%", height: "56px"}} handler={closeHandler} content="OK"/>
                </PopupBottom>
            </PopupContainer>
        </OverlayPopup>
    )
}
