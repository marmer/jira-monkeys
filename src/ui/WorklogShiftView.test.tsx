import * as reactTest from "@testing-library/react";
import React from "react";
import WorklogService, {Worklog} from "../core/WorklogService";
import WorklogShiftView from "./WorklogShiftView";

describe("WorklogShiftView", () => {

    const worklogBase: Worklog = {
        issueId: "42",
        author: {
            name: "real.me",
            displayName: "Me",
        },
        timeSpentInMinutes: 1337,
        started: "2000-01-01T00:00:00.000+0000",
        id: "43",
        comment: "did something",
    };

    it("should not show an estimation whil it's loading", async () => {
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([{...worklogBase}] as Worklog[]);

        const underTest = reactTest.render(<WorklogShiftView/>);
        expect(underTest).toMatchSnapshot();
    });

    it("should show the estimations for the current user and issue when loading is done", async () => {
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([
            {
                ...worklogBase,
                author: {...worklogBase.author, displayName: "Me"},
                comment: "first step",
                started: "2019-10-01T01:02:03.000+0200",
                timeSpentInMinutes: 1,
                id: "1111",
                issueId: "11",
            },
            {
                ...worklogBase,
                author: {...worklogBase.author, displayName: "Me Too"},
                comment: "second step",
                started: "2020-01-10T02:03:04.000+0200",
                timeSpentInMinutes: 2,
                id: "2222",
                issueId: "22",
            }] as Worklog[]);

        const underTest = reactTest.render(<WorklogShiftView/>);
        await reactTest.waitForElement(() => underTest.getByDisplayValue("first step"));
        expect(underTest).toMatchSnapshot();
    });

    // TODO: marmer 07.10.2019 errorhandling while loading
    // TODO: marmer 07.10.2019 errorhandling while shifting
    // TODO: marmer 07.10.2019 Shifting
    // TODO: marmer 07.10.2019 Handling of missing worklog parts (author, Comment, Start, ...)
});
