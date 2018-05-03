import { css } from 'emotion';

export const optionDropdownWrapper = `optionDropdownWrapper ${css`
  position: absolute;
  background: white;
  min-width: 100%;
  z-index: 1;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  cursor: pointer;
  padding: 5px;
  top: 100%;
`}`;

export default `select ${css`
  position: relative;
  white-space: nowrap;
  border-radius: 10px;
  background-color: #ffffff;
  border: solid 1px #cacbcf;
  color: #343434;
  font-size: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left: 10px;
`}`;
