import React, {useContext, useEffect} from "react";
import {LoadingContext} from "../../contexts/LoaderContext";

export const useLoader = () => {
    const { loading, setLoading, timeToShow, setTimeToShow } = useContext(LoadingContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, timeToShow);
        return () => clearTimeout(timer);
    }, [])

    const setLoader = (timeout: number, value: boolean) => {
        setLoading(value)
        setTimeToShow(timeout)
    }

    return {loading, setLoader};
}
