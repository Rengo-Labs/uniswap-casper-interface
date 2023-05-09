import React, {useEffect} from "react";
import Layout from "../../../layout";
import { LiquidityPoolTemplate } from "../../templates/LiquidityPoolTemplate";
import { useDeviceType } from "rengo-ui-kit";
import {useLoader} from "../../../hooks/useLoader";

export const Pools = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";
  const {setLoader}  = useLoader();

  useEffect(() => {
    setLoader(1000, true)
  }, [])

  return (
    <Layout>
      <LiquidityPoolTemplate isMobile={isMobile} />
    </Layout>
  );
};
