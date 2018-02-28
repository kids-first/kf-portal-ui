import React from 'react';
import Modal from 'react-modal';
import { injectState } from 'freactal';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import CloseIcon from 'react-icons/lib/md/close';

import { provideModalState } from 'stateProviders';

const enhance = compose(withTheme, provideModalState, injectState);

const Header = enhance(({ title, theme, effects: { setModal }, modalProps }) => {
  return (
    <h2
      css={`
        ${theme.profileH2} ${theme.row} justify-content: space-between;
      `}
    >
      {title}
      <CloseIcon onClick={() => setModal({ content: null })} />
    </h2>
  );
});

export default enhance(({ title, children, theme, ...modalProps }) => (
  <Modal {...modalProps}>
    <Header {...{ title, theme, modalProps }} />
    {children}
  </Modal>
));
