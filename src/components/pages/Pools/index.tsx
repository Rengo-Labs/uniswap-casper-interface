import React from "react";
import Layout from "../../../layout";
import { LiquidityPoolTemplate } from "../../templates/LiquidityPoolTemplate";
import { useDeviceType } from "rengo-ui-kit";

export const Pools = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";

  return (
    <Layout>
      <LiquidityPoolTemplate isMobile={isMobile} />
    </Layout>
  );
};
