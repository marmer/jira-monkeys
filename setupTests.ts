import {configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import fetchMock from "fetch-mock";

configure({adapter: new Adapter()});

fetchMock.restore();
