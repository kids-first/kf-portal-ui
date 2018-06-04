import styled from 'react-emotion';


const HeadingBaseStyles = `
  
`;

export const HeadingH2 = styled('h2')`
  ${({ theme }) => theme.h2};
`;

// export const HeadingH3 = styled('h3')`
//   font-size: 20px;
//   font-weight: 300;
//   line-height: 1;
//   letter-spacing: 0.3px;
//   text-align: left;
//   color: ${({ theme }) => theme.primaryHover};
//   margin: 0;
// `;

export const HeadingH3 = styled('h3')`
  ${({ theme }) => theme.primaryHover};
`;
// export const HeadingH3 = styled('h3')`
//   font-size: 20px;
//   font-weight: 300;
//   line-height: 1;
//   letter-spacing: 0.3px;
//   text-align: left;
//   color: ${({ theme }) => theme.primaryHover};
//   margin: 0;
// `;