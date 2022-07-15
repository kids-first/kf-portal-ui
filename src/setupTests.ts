// ref: https://github.com/enzymejs/enzyme/issues/1265#issuecomment-367401475
import 'regenerator-runtime/runtime';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });

jest.mock('@kfarranger/components/dist', () =>
  jest.fn().mockImplementation(() => ({
    addHeaders: () => {},
  })),
);
