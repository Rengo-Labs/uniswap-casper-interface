import React from 'react';
import Layout from '../../../layout';
import TokenSwapper from "../../organisms/TokenSwapper";
export const Swap = () => {
  return (
      <Layout>
        <div style={{display: "flex"}}>
          <div style={{flex: "1"}}></div>
          <div style={{flex: "1"}}>
            <TokenSwapper />
          </div>
        </div>
      </Layout>
  )
};
