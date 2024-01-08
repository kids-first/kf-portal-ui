import { BrowserRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from 'tests/setupTests';

import AuthorizedStudies from '.';

describe('AuthorizedStudies', () => {
  test('make sure AuthorizedStudies render correctly', () => {
    renderWithProviders(
      <BrowserRouter>
        <AuthorizedStudies id="1" />
      </BrowserRouter>,
    );
    expect(screen.getByText('Authorized Studies')).toBeTruthy();
  });
});
