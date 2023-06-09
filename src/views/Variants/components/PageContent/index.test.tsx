import '../../../../tests/mocks/matchMedia.mock';

import { renderWithProviders } from 'tests/setupTests';

import PageContent from './index';

test.skip('should a loading placeholder if variantMapping is loading', () => {
  renderWithProviders(
    <PageContent
      variantMapping={{
        data: [],
        loading: true,
      }}
    />,
  );
});
