import React, {useEffect, useState} from "react";
const isMobileScreen = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = 768;
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= breakpoint);
}

export default isMobileScreen
