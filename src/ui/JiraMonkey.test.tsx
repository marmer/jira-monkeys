import React from 'react'
import JiraMonkey from "./JiraMonkey";
import {configure, shallow} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import WorklogSummarizerView from "./WorklogSummarizerView";

configure({adapter: new Adapter()});

describe("JiraMonkey", () => {

    it('should render WorklogSummarizerView', () => {
        const jiraMonkey = shallow(<JiraMonkey/>);
        expect(jiraMonkey.contains(<WorklogSummarizerView/>)).toBe(true);
    });
});
