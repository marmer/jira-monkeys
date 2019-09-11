import {shallow, ShallowWrapper} from "enzyme";
import React from "react";
import JiraMonkey from "./JiraMonkey";
import WorklogSummarizerView from "./WorklogSummarizerView";

describe("JiraMonkey", () => {
    let jiraMonkey: ShallowWrapper<any, any, React.Component>;
    let checkbox: ShallowWrapper<any, any>;

    beforeEach(() => {
        jiraMonkey = shallow(<JiraMonkey/>);
        checkbox = jiraMonkey.find('input[type="checkbox"]');
    });

    it("should render only a deactivated checkbox at mount", () => {
        expect(checkbox.prop("checked")).toBe(false);
    });

    it("should render not the WorklogSummarizerView on mount", () => {
        expect(jiraMonkey.contains(<WorklogSummarizerView/>)).toBe(false);
    });

    // TODO: marmer 09.09.2019 care!
    it.skip("should render the WorklogSummarizerView when the tool activation checkbox is activated", () => {
        checkbox.simulate("click");
        expect(jiraMonkey.contains(<WorklogSummarizerView/>)).toBe(true);
    });

    // TODO: marmer 09.09.2019 care!
    it.skip("should not reander the WorklogSummarizerView when the tool activation checkbos is deactivated after activation again", () => {
        checkbox.simulate("click");
        checkbox.simulate("click");
        expect(jiraMonkey.contains(<WorklogSummarizerView/>)).toBe(true);
    });
});
