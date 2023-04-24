import React from 'react';
import Layout from '../../../layout';
import { DoubleColumn } from '../../../layout/DoubleColumn';
import { useDeviceType } from 'rengo-ui-kit';
import { SingleColumn } from '../../../layout/SingleColumn';

export const Swap = () => {
  const deviceType = useDeviceType()
  const isMobile = deviceType === 'mobile'

  return (
      <Layout>
            <div>
              Swap
              <DoubleColumn isMobile={isMobile}>
                <div style={{height: '400px',  background: 'lightgreen' }}>left component</div>
                <div style={{height: '460px',  background: 'tomato' }}>right component</div>
              </DoubleColumn>
              
              <SingleColumn isMobile={isMobile}>
                <div style={{height: '400px',  background: 'lightblue' }}>Single column component</div>
              </SingleColumn>
            </div>
      </Layout>
  )
};
