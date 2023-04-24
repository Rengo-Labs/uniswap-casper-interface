import React, {useState} from "react";
const useConnectionPopUp = () => {
    const [showConnectionPopup, setShowConnectionPopup] = useState(false);
    const handleConnectionPopup = () => {
        setShowConnectionPopup(!showConnectionPopup);
    };

    return {
        showConnectionPopup,
        setShowConnectionPopup,
        handleConnectionPopup
    }
}

export default useConnectionPopUp;
