import * as reactTest from "@testing-library/react";
import React from "react";
import JiraMonkey from "./JiraMonkey";

jest.mock("./WorklogSummarizerView", () => (): React.ReactNode => <div>WorklogSummarizerViewMock</div>);
jest.mock("./EstimationShiftView", () => (): React.ReactNode => <div>EstimationShiftViewMock</div>);

describe("JiraMonkey", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should be possible to show and hide the different jira monkeys as well as the whole monkey selection", async () => {
        const jiraMonkey = reactTest.render(<JiraMonkey/>);
        expect(jiraMonkey.container.querySelector("#JiraMonkeyContainer")).toBeNull();
        expect(jiraMonkey.container).toMatchSnapshot("initial state");

        reactTest.fireEvent.click(jiraMonkey.getByTitle("Jira Monkeys"));
        expect(jiraMonkey.container.querySelector("#JiraMonkeyContainer")).not.toBeNull();
        expect(jiraMonkey.getByText("Worklog-summarizer")).toBeVisible();
        expect(jiraMonkey.getByText("Estimation-shifter")).toBeVisible();
        expect(jiraMonkey.getByText("Booking-shifter")).toBeVisible();
        expect(jiraMonkey.getByText("Estimation-fixer")).toBeVisible();
        expect(jiraMonkey.container).toMatchSnapshot("on activated toolbar");

        reactTest.fireEvent.click(jiraMonkey.getByText("Worklog-summarizer"));
        expect(jiraMonkey.container).toMatchSnapshot("on activated toolbar with worklog summarizer");

        reactTest.fireEvent.click(jiraMonkey.getByText("Estimation-shifter"));
        expect(jiraMonkey.container).toMatchSnapshot("on activated toolbar with estimation shifter");

        reactTest.fireEvent.click(jiraMonkey.getByText("Booking-shifter"));
        expect(jiraMonkey.container).toMatchSnapshot("on activated toolbar with booking shifter");

        reactTest.fireEvent.click(jiraMonkey.getByText("Estimation-fixer"));
        expect(jiraMonkey.container).toMatchSnapshot("on activated toolbar with estimation fixer");

        reactTest.fireEvent.click(jiraMonkey.getByTitle("Jira Monkeys"));
        expect(jiraMonkey.container).toMatchSnapshot("on inactive toolbar");
    });

    it("should remind whether it's active or not between different renderings", () => {
        const jiraMonkeyOld = reactTest.render(<JiraMonkey/>);
        reactTest.fireEvent.click(jiraMonkeyOld.getByTitle("Jira Monkeys"));
        const oldStateAsString = reactTest.prettyDOM(jiraMonkeyOld.container);
        jiraMonkeyOld.unmount();

        const jiraMonkeyNew = reactTest.render(<JiraMonkey/>);

        expect(oldStateAsString).toBe(reactTest.prettyDOM(jiraMonkeyNew.container));
    });
});
