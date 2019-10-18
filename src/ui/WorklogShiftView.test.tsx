import * as reactTest from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment = require("moment-timezone");
import React, {FunctionComponent} from "react";
import EstimationCrudService, {Estimation} from "../core/EstimationCrudService";
import JiraTimeService from "../core/JiraTimeService";
import WindowService from "../core/WindowService";
import WorklogService, {Worklog} from "../core/WorklogService";
import WorklogShiftService from "../core/WorklogShiftService";
import WorklogShiftView from "./WorklogShiftView";

moment.tz.setDefault("Europe/Berlin");

jest.mock("./ModalView", () => ((({children, onClose}) =>
    <>
        <div data-testid="errorViewMock">
            {children}
        </div>
        <button data-testid="errorViewCloseButton" onClick={onClose}>X</button>
    </>) as FunctionComponent<{ onClose: () => void }>));

describe("WorklogShiftView", () => {
    beforeEach(() => {
        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(issueKey => {
            return Promise.resolve({issueSummary: "Did something", issueKey} as Estimation);
        });
        JiraTimeService.isValidJiraFormat = jest.fn().mockReturnValue(true);
        sessionStorage.clear();
    });

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
        WorklogShiftService.shiftWorklog = jest.fn().mockResolvedValue(undefined);
        WindowService.reloadPage = jest.fn();

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "TARGET-123");
        userEvent.type(underTest.getByTestId("ShiftInput" + worklogBase.id), "5m");
        const shiftButton = underTest.getByTestId("ShiftButton" + worklogBase.id);
        userEvent.click(shiftButton);

        await reactTest.wait(() => expect(WorklogShiftService.shiftWorklog).toBeCalledWith(sourceWorklog, "5m", "TARGET-123"));
        expect(WindowService.reloadPage).toBeCalled();
    });

    it("should show a blocking error message when shifting is not successful and reload the page when the user closes it", async () => {
        const sourceWorklog = {...worklogBase};
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([sourceWorklog] as Worklog[]);
        WorklogShiftService.shiftWorklog = jest.fn().mockRejectedValue(new Error("el barto was here"));
        WindowService.reloadPage = jest.fn();

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "TARGET-123");
        userEvent.type(underTest.getByTestId("ShiftInput" + worklogBase.id), "5m");
        const shiftButton = underTest.getByTestId("ShiftButton" + worklogBase.id);
        userEvent.click(shiftButton);

        const errorView = await reactTest.waitForElement(() => underTest.getByTestId("errorViewMock"));
        await reactTest.waitForElement(() => reactTest.getByText(errorView, "An unexpected error has occured while shifting the worklog. Please check the worklogs of this issue and the target issue. The Site is getting reloaded when you close this message. Error: el barto was here"));

        userEvent.click(underTest.getByTestId("errorViewCloseButton"));
        await reactTest.wait(() => expect(WindowService.reloadPage).toBeCalled());
    });

    it("should not be possible to shift anything when not target is set", async () => {
        const sourceWorklog = {...worklogBase};
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([sourceWorklog] as Worklog[]);
        WorklogShiftService.shiftWorklog = jest.fn().mockResolvedValue(undefined);
        WindowService.reloadPage = jest.fn();

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "  ");
        userEvent.type(underTest.getByTestId("ShiftInput" + worklogBase.id), "5m");
        const shiftButton = underTest.getByTestId("ShiftButton" + worklogBase.id);
        expect(shiftButton).toBeDisabled();
    });

    it("should not be possible to shift time when the related input does not contain a jira string", async () => {
        const sourceWorklog = {...worklogBase};
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([sourceWorklog] as Worklog[]);
        WorklogShiftService.shiftWorklog = jest.fn().mockResolvedValue(undefined);
        WindowService.reloadPage = jest.fn();
        const invalidJiraString = "someInvalidJiraString";
        JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(jiraString => jiraString !== invalidJiraString);

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "someTargetIssueKey-123");
        userEvent.type(underTest.getByTestId("ShiftInput" + worklogBase.id), invalidJiraString);
        const shiftButton = underTest.getByTestId("ShiftButton" + worklogBase.id);
        expect(shiftButton).toBeDisabled();
    });

    it("should set the time spent value of the related worklogs as default value for the time to shift", async () => {
        const sourceWorklog = {...worklogBase};
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([sourceWorklog] as Worklog[]);
        const jiraString = "someJiraString";
        JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(timeSpent => {
            if (timeSpent !== sourceWorklog.timeSpentInMinutes) {
                fail("Unexpected Input: " + timeSpent);
            }
            return jiraString;
        });

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "someTargetIssueKey-123");

        expect(underTest.getByTestId("ShiftInput" + worklogBase.id)).toHaveValue(jiraString);
    });

    it("should keep the target issue key when the site reloads", async () => {
        const sourceWorklog = {...worklogBase};
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([sourceWorklog] as Worklog[]);
        WorklogShiftService.shiftWorklog = jest.fn().mockResolvedValue(undefined);
        WindowService.reloadPage = jest.fn();

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "TARGET-123");
        underTest.unmount();

        const underTestAfterReload = reactTest.render(<WorklogShiftView/>);
        const targetIssueInputAfterReload = await reactTest.waitForElement(() => underTestAfterReload.getByTitle("Target Issue"));
        expect(targetIssueInputAfterReload).toHaveValue("TARGET-123");
    });

    it("should show the issue summary of the target issue if it can be loaded", async () => {
        const estimation: Estimation = {
            issueSummary: "fancy summary",
            issueKey: "TARGET-123",
        };

        const sourceWorklog = {...worklogBase};
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([sourceWorklog] as Worklog[]);
        WorklogShiftService.shiftWorklog = jest.fn().mockResolvedValue(undefined);
        WindowService.reloadPage = jest.fn();
        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(issueKey => {
            return Promise.resolve(estimation);
        });

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "TARGET-123");
        const summaryField = await reactTest.waitForElement(() => underTest.getByText(estimation.issueSummary));

        expect(summaryField).not.toBeNull();
    });

    it("should handle errors by not showing anything", async () => {
        const estimation: Estimation = {
            issueSummary: "fancy summary",
            issueKey: "TARGET-123",
        };

        const sourceWorklog = {...worklogBase};
        WorklogService.getWorklogsForCurrentIssueAndUser = jest.fn().mockResolvedValue([sourceWorklog] as Worklog[]);
        WorklogShiftService.shiftWorklog = jest.fn().mockResolvedValue(undefined);
        WindowService.reloadPage = jest.fn();
        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(issueKey => {
            return Promise.reject(new Error("Something went wrong"));
        });

        const underTest = reactTest.render(<WorklogShiftView/>);
        const targetIssueInput = await reactTest.waitForElement(() => underTest.getByTitle("Target Issue"));

        userEvent.type(targetIssueInput, "TARGET-123");
        const summaryField = await reactTest.waitForElement(() => underTest.getByTestId("targetLoadErrorMarker"));

        expect(summaryField).not.toBeNull();
    });

    // TODO: marmer 17.10.2019 Clone
    // TODO: marmer 17.10.2019 current ticket as default ticket on mount(when nothing is stored in session storage)
    // TODO: marmer 17.10.2019 Prevent invalid inputs for the copy start time

});
