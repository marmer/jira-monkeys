import * as reactTest from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import WindowService from "../core/WindowService";
import WorklogService, {Worklog} from "../core/WorklogService";
import WorklogShiftService from "../core/WorklogShiftService";
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

    it("should not show a worklog while it's loading", async () => {
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([{...worklogBase}] as Worklog[]);

        const underTest = reactTest.render(<WorklogShiftView/>);
        expect(underTest).toMatchSnapshot();
    });

    it("should show the worklogs for the current user and issue when loading is done", async () => {
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
        await reactTest.waitForElement(() => underTest.getByText("first step"));
        expect(underTest).toMatchSnapshot();
    });

    it("should describe the absence of own worklogs", async () => {
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([] as Worklog[]);

        const underTest = reactTest.render(<WorklogShiftView/>);
        await reactTest.waitForElement(() => underTest.getByText("No work logged here for you yet"));
        expect(underTest).toMatchSnapshot();
    });

    it("should tell the user when an error has occurred", async () => {
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockRejectedValue(new Error("dafuq"));

        const underTest = reactTest.render(<WorklogShiftView/>);
        await reactTest.waitForElement(() => underTest.getByText("Error while loading worklogs for issue: dafuq"));
        expect(underTest).toMatchSnapshot();
    });

    it("should reload the current site after some worklog has been shifted", async () => {
        const sourceWorklog = {...worklogBase};
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([sourceWorklog] as Worklog[]);
        WorklogShiftService.shiftFromWorklog = jest.fn().mockResolvedValue(undefined);
        WindowService.reloadPage = jest.fn();

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "TARGET-123");
        userEvent.type(underTest.getByTestId("ShiftInput" + worklogBase.id), "5m");
        const shiftButton = underTest.getByTestId("ShiftButton" + worklogBase.id);
        userEvent.click(shiftButton);

        await reactTest.wait(() => expect(WorklogShiftService.shiftFromWorklog).toBeCalledWith(sourceWorklog, "5m", "TARGET-123"));
        expect(WindowService.reloadPage).toBeCalled();
    });

    // TODO: marmer 08.10.2019 default values
    // TODO: marmer 07.10.2019 errorhandling while shifting
    // TODO: marmer 07.10.2019 Handling of missing worklog parts (author, Comment, Start, ...)
    // TODO: marmer 07.10.2019 Keep destination issue in session storage in case the user wants to shift more than one worklog
    // TODO: marmer 07.10.2019 Shifting should only be possible if the target issue exists
    // TODO: marmer 07.10.2019 show some target issue details
    // TODO: marmer 07.10.2019 handle errors while loading the target issue
});
