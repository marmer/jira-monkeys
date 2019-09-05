import React from 'react'
import JiraMonkey from "./JiraMonkey";
import {shallow} from "enzyme";
import WorklogSummarizerView from "./WorklogSummarizerView";


describe("JiraMonkey", () => {

    it('should render WorklogSummarizerView', () => {
        const jiraMonkey = shallow(<JiraMonkey/>);
        expect(jiraMonkey.contains(<WorklogSummarizerView/>)).toBe(true);
    });
});
