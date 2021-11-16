import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';

import TermsConditionsAcceptButton from 'components/LoginPage/TermsConditions//TermsConditionsAcceptButton';
import TermsConditionsBody from 'components/LoginPage/TermsConditions//TermsConditionsBody';
import SplashPage from 'components/SplashPage';
import { revertAcceptedTermsThenLogoutCleanly } from 'store/actionCreators/user';
import { DispatchUser } from 'store/userTypes';

import './index.css';

const TermsConditions = () => {
  const dispatch = useDispatch<DispatchUser>();
  return (
    <SplashPage
      title={'Terms & Conditions'}
      extra={'Last Update Date: 7/22/20'}
      mainTitle={'Terms & Conditions'}
      content={<TermsConditionsBody />}
      footerContent={
        <div className={'action-buttons-wrapper'}>
          <Button
            key={'decline'}
            onClick={async () => await dispatch(revertAcceptedTermsThenLogoutCleanly())}
          >
            Decline
          </Button>
          <TermsConditionsAcceptButton key={'accept'} type={'primary'} isNewUser={false} />
        </div>
      }
    />
  );
};

export default TermsConditions;
