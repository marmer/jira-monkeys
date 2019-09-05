import React from 'react'
import JiraMonkey from "./JiraMonkey";
import {shallow} from "enzyme";
import WorklogSummarizerView from "./WorklogSummarizerView";


describe("JiraMonkey", () => {

    it('should render WorklogSummarizerView', () => {
        const jiraMonkey = shallow(<JiraMonkey/>);
        let shallowWrapper = jiraMonkey.find("input[type=checkbox]");

        // jiraMonkey.find("input").find({type:"checkbox"}).prop("checked")

        expect(jiraMonkey.contains(<WorklogSummarizerView/>)).toBe(true);
    });
});
