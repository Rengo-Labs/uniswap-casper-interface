import React from "react";
import {useLoader} from "../../../hooks/useLoader";
import {Loader} from 'rengo-ui-kit';
import {Container} from "./styles";
const CasperLoader = ({ children }) => {
    const {loading}  = useLoader();
    return loading ? <Container><Loader><></></Loader></Container> : children;
};

export default CasperLoader;
