export const Pagination = stlyed('div')`
display: flex;
justifyContent: space-between;
alignItems: center;

& .-pageJump {
  border: solid 1px lightgrey;
  border-radius: 5px;
}

& .-pagination_button {
  cursor: pointer;
  padding-left: 10px;
  padding-right: 10px;
  color: grey;
  user-select: none;
}

& .-pagination_button.-current {
  background: lightgrey;
  color: #f0f1f6;
}
`;
