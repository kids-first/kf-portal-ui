import { StaticRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { IVariantEntity as IVariantEntityFerlab } from '@ferlab/ui/core/pages/EntityPage/type';
import { variantDataMock } from 'graphql/variants/mocks';

import SummaryHeader from './index';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // 3- Import non-mocked library and use other functionalities and hooks
  ...(jest.requireActual('react-router-dom') as any),

  // 4- Mock the required hook
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('react-intl-universal', () => ({ get: jest.fn() }));

describe('SummaryHeader', () => {
  let data: IVariantEntityFerlab;

  beforeEach(() => {
    data = variantDataMock;
  });

  it('renders correctly', () => {
    //@ts-ignore
    const tree = renderer.create(
      <StaticRouter location="someLocation">
        <SummaryHeader variant={data} />
      </StaticRouter>,
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
