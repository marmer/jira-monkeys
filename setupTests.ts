import "@testing-library/jest-dom/extend-expect";
import * as reactTest from "@testing-library/react";
import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import fetchMock from "fetch-mock";

configure({adapter: new Adapter()});

fetchMock.restore();
reactTest.cleanup();
