import * as dom from "@testing-library/dom";
import {cleanup, render, waitForElement} from "@testing-library/react";
import React from "react";
import WorklogService, {Worklog} from "../core/WorklogService";
import WorklogSummarizerView from "./WorklogSummarizerView";

describe("WorklogSummarizerView", () => {
    afterEach(() => cleanup());
    it("should render the worklog entries", async () => {
        WorklogService.getSummedWorklogsByUser = jest.fn().mockImplementation(() => Promise.resolve([
            {
                timeSpentInMinutes: 5,
                author: {
                    displayName: "Billy Big",
                },
            },
            {
                timeSpentInMinutes: 15,
                author: {
                    displayName: "Claudette clever",
                },
            },
            {
                timeSpentInMinutes: 10,
                author: {
                    displayName: "Andy Anderson",
                },
            }] as Worklog[]));

        const worklogSummarizerView = render(<WorklogSummarizerView/>);
        expect(worklogSummarizerView.container).toMatchSnapshot("onInitialLoading");
        await waitForElement(() => worklogSummarizerView.getByText("Worklogs summarized per User"));
        expect(worklogSummarizerView.container).toMatchSnapshot("whenLoadingIsDone");

        dom.fireEvent.click(worklogSummarizerView.getByText("time spent"));
        expect(worklogSummarizerView.container).toMatchSnapshot("whenSortedByTimeSpent");

        dom.fireEvent.click(worklogSummarizerView.getByText("display name"));
        expect(worklogSummarizerView.container).toMatchSnapshot("whenSortedByDisplayName");
        // console.log(prettyDOM(worklogSummarizerView.container));
    });

    it("should sho when an error occurs while loading the worklog summary", async () => {

        WorklogService.getSummedWorklogsByUser = jest.fn().mockImplementation(() => Promise.reject(new Error("Some loading error")));

        const worklogSummarizerView = render(<WorklogSummarizerView/>);
        expect(worklogSummarizerView.container).toMatchSnapshot("onInitialLoading");
        await waitForElement(() => worklogSummarizerView.getByText("Error. Wanna try to reaload? ;)"));

        expect(worklogSummarizerView.container).toMatchSnapshot("whenLoadingIsDone");
        console.log(dom.prettyDOM(worklogSummarizerView.container));
    });

});
