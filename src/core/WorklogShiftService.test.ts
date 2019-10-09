import JiraTimeService from "./JiraTimeService";
import WorklogService, {Worklog} from "./WorklogService";
import WorklogShiftService from "./WorklogShiftService";

describe("WorklogShiftService", () => {
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

    describe("shiftWorklog", () => {
        it("should reject when given time to shift is not a valid jira string", async () => {
            const cause = new Error("Invalid String Error Message");
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "invalidJiraString") {
                    fail("unexpected input: " + jiraString);
                }
                throw cause;
            });

            expect(WorklogShiftService.shiftWorklog({...worklogBase}, "invalidJiraString", "targetIssueKey-123")).rejects.toStrictEqual(cause);
        });

        it("should reject when someone tries to shift more time than exists on a worklog", async () => {
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return 5;
            });

            expect(WorklogShiftService.shiftWorklog({
                ...worklogBase,
                timeSpentInMinutes: 4,
            }, "validJiraString", "targetIssueKey-123")).rejects.toStrictEqual(new Error("It's not possible to shift more time than exist on a worklog"));
        });

        it("should create a worklog at the target issue with the given time to shift", async () => {
            const timeToShiftInMinutes = 2;

            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return timeToShiftInMinutes;
            });

            WorklogService.createWorklog = jest.fn().mockResolvedValue(undefined);
            WorklogService.deleteWorklog = jest.fn().mockResolvedValue(undefined);
            WorklogService.updateWorklog = jest.fn().mockResolvedValue(undefined);

            await WorklogShiftService.shiftWorklog({
                ...worklogBase,
                timeSpentInMinutes: 5,
            }, "validJiraString", "targetIssueKey-123");

            expect(WorklogService.createWorklog).toBeCalledWith({
                timeSpentInMinutes: timeToShiftInMinutes,
                started: worklogBase.started,
                issueKey: "targetIssueKey-123",
                comment: worklogBase.comment,
            } as {
                timeSpentInMinutes: number;
                started: string;
                comment: string;
                issueKey: string;
            });
        });

        it("should delete the source worklog when the same amount of time is shifted than exists at the source worklog", async () => {
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return 5;
            });

            WorklogService.createWorklog = jest.fn().mockResolvedValue(undefined);
            WorklogService.deleteWorklog = jest.fn().mockResolvedValue(undefined);

            const worklogToShift = {
                ...worklogBase,
                timeSpentInMinutes: 5,
            };
            await WorklogShiftService.shiftWorklog(worklogToShift, "validJiraString", "targetIssueKey-123");

            expect(WorklogService.deleteWorklog).toBeCalledWith(worklogToShift);
        });

        it("should update the source worklog when the less time is shifted than exists at the source worklog", async () => {
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return 3;
            });

            WorklogService.createWorklog = jest.fn().mockResolvedValue(undefined);
            WorklogService.updateWorklog = jest.fn().mockResolvedValue(undefined);

            const worklogToShift = {
                ...worklogBase,
                timeSpentInMinutes: 5,
            };
            await WorklogShiftService.shiftWorklog(worklogToShift, "validJiraString", "targetIssueKey-123");

            expect(WorklogService.updateWorklog).toBeCalledWith({...worklogToShift, timeSpentInMinutes: 2});
        });

        it("should not update anything when no time has to be shifted", async () => {
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return 0;
            });

            WorklogService.createWorklog = jest.fn();
            WorklogService.updateWorklog = jest.fn();
            WorklogService.deleteWorklog = jest.fn();

            const worklogToShift = {
                ...worklogBase,
                timeSpentInMinutes: 5,
            };
            await WorklogShiftService.shiftWorklog(worklogToShift, "validJiraString", "targetIssueKey-123");

            expect(WorklogService.updateWorklog).not.toBeCalled();
            expect(WorklogService.createWorklog).not.toBeCalled();
            expect(WorklogService.deleteWorklog).not.toBeCalled();
        });

        it("should reject with an appropriate error message without touching the source worklog when an error occures while creating the new worklog", async () => {
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return 5;
            });

            WorklogService.createWorklog = jest.fn().mockRejectedValue(new Error("do'h"));
            WorklogService.updateWorklog = jest.fn().mockResolvedValue(undefined);
            WorklogService.deleteWorklog = jest.fn().mockResolvedValue(undefined);

            const worklogToShift = {
                ...worklogBase,
                timeSpentInMinutes: 5,
            };
            expect(WorklogShiftService.shiftWorklog(worklogToShift, "validJiraString", "targetIssueKey-123")).rejects.toStrictEqual(new Error("Error while creating the new worklog. At least the source worklog has not been changed yet."));

            expect(WorklogService.updateWorklog).not.toBeCalled();
            expect(WorklogService.deleteWorklog).not.toBeCalled();
        });

        it("should reject with an appropriate error message when the updating the source worklog is not successful", async () => {
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return 2;
            });

            WorklogService.createWorklog = jest.fn().mockResolvedValue(undefined);
            WorklogService.updateWorklog = jest.fn().mockRejectedValue(new Error("eat my shorts!"));

            const worklogToShift = {
                ...worklogBase,
                timeSpentInMinutes: 5,
            };
            expect(WorklogShiftService.shiftWorklog(worklogToShift, "validJiraString", "targetIssueKey-123")).rejects.toStrictEqual(new Error("Error while updating the worklog to change (source)."));
        });

        it("should reject with an appropriate error message when the updating the source worklog is not successful", async () => {
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return 5;
            });

            WorklogService.createWorklog = jest.fn().mockResolvedValue(undefined);
            WorklogService.deleteWorklog = jest.fn().mockRejectedValue(new Error("eat my underwear!"));

            const worklogToShift = {
                ...worklogBase,
                timeSpentInMinutes: 5,
            };
            expect(WorklogShiftService.shiftWorklog(worklogToShift, "validJiraString", "targetIssueKey-123")).rejects.toStrictEqual(new Error("Error while updating the worklog to change (source)."));
        });
    });
});
