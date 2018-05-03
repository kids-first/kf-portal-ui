import { css } from 'emotion';

export default {
  modalOverlay: `modalOverlay ${css`
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    display: block;
    z-index: 1000;
  `}`,
  modal: `modal ${css`
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    position: absolute;
    border: 1px solid rgb(204, 204, 204);
    background: rgb(255, 255, 255);
    border-radius: 4px;
    transform: translate(-50%, -50%);
    width: 95%;
    box-sizing: border-box;
    padding: 20px 20px;
    max-width: 1000px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;
    overflow: visible;
    display: flex;
    flex-direction: column;

    & .modalHeader {
      justify-content: space-between;
      border-bottom: 1px solid #d4d6dd;
      margin-bottom: 1.5em;
    }

    &.withFooter {
      padding-bottom: 75px;
    }

    & .modalFooter {
      background-color: #edeef1;
      border-radius: 5px;
      padding: 1em;
      margin-top: 1em;
      justify-content: space-between;
      position: absolute;
      left: 0px;
      right: 0px;
      bottom: 0px;
      & .footerContent {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `}`,
};
