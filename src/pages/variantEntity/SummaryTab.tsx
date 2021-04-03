import React, { FC } from 'react';
import Card from '@ferlab/ui/core/view/GridCard';

const Summary: FC = () => (
  <div className={'content-container'}>
    <Card>
      <div className={'grid-top-container'}>
        <div className={'grid-top-container-item'}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '25%' }}>Chr</div>
            <div style={{ width: '75%' }}>missing</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '25%' }}>Start</div>
            <div style={{ width: '75%' }}>33</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '25%' }}>Allele Alt.</div>
            <div style={{ width: '75%' }}>33</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '25%' }}>Allele Réf.</div>
            <div style={{ width: '75%' }}>33</div>
          </div>
        </div>
        <div className={'grid-top-container-item'}>
          <div className={'grid-top-container-item'}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '25%' }}>rre</div>
              <div style={{ width: '75%' }}>33</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

export default Summary;
