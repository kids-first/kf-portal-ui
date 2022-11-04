import { render, screen } from '@testing-library/react';
import { renderWithProviders } from 'tests/setupTests';
import PageContent from './index';
import 'tests/mocks/matchMedia.mock';

test('should a loading placeholder if variantMapping is loading', () => {
  renderWithProviders(
    <PageContent
      variantMapping={{
        data: [],
        loading: true,
      }}
    />,
  );
});
