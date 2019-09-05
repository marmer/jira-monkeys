import React from 'react'
import JiraMonkey from "./JiraMonkey";
import {shallow} from "enzyme";
import WorklogSummarizerView from "./WorklogSummarizerView";
import setupTests from "../setupTests";


describe("JiraMonkey", () => {

    beforeEach(() => setupTests())

    it('should render WorklogSummarizerView', () => {
        const jiraMonkey = shallow(<JiraMonkey/>);
        expect(jiraMonkey.contains(<WorklogSummarizerView/>)).toBe(true);
    });
});
