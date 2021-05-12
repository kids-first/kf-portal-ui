// ref: https://github.com/enzymejs/enzyme/issues/1265#issuecomment-367401475
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
