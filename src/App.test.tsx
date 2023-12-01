import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import App from './App';

test('renders learn react link', () => {
  const { container } = render(
    <MockedProvider>
      <App />
    </MockedProvider>,
  );
  const view = container.getElementsByClassName('#appContainer');

  expect(view).toBeTruthy();
});
