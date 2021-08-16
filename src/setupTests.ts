// ref: https://github.com/enzymejs/enzyme/issues/1265#issuecomment-367401475
import 'regenerator-runtime/runtime';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('@kfarranger/components/dist', () =>
  jest.fn().mockImplementation(() => ({
    addHeaders: () => {},
  })),
);
