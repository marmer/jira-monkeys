import fn = jest.fn;
import "@testing-library/jest-dom/extend-expect";
import {cleanup, render} from "@testing-library/react";
import React from "react";
import WorklogService, {Worklog} from "../core/WorklogService";
import WorklogSummarizerView from "./WorklogSummarizerView";

describe("WorklogSummarizerView", () => {
    afterEach(() => cleanup());
    it("should render the worklog entries", () => {
        WorklogService.getSummedWorklogsByUser = fn().mockImplementation(() => [
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
            }] as Worklog[]);

        const worklogSummarizerView = render(<WorklogSummarizerView/>);
        worklogSummarizerView.find;
    });
});
