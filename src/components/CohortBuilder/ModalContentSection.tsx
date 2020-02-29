import * as React from 'react';

type ModalContentSectionProps = {
  children: object;
};

export const ModalContentSection = (props: ModalContentSectionProps) => (
  <div className="cb-modalContentSection">{props.children}</div>
);
