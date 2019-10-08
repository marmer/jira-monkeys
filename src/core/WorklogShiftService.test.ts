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
            JiraTimeService.jiraFormatToMinutes = jest.fn().mockImplementation((jiraString) => {
                if (jiraString !== "validJiraString") {
                    fail("unexpected input: " + jiraString);
                }

                return 5;
            });

            WorklogService.createWorklog = jest.fn().mockResolvedValue(undefined);
            WorklogService.deleteWorklog = jest.fn().mockResolvedValue(undefined);

            await WorklogShiftService.shiftWorklog({
                ...worklogBase,
                timeSpentInMinutes: 5,
            }, "validJiraString", "targetIssueKey-123");

            expect(WorklogService.createWorklog).toBeCalledWith({
                timeSpentInMinutes: 5,
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

        // TODO: marmer 08.10.2019 it should do nothing when someone tries to shift zero time
        // TODO: marmer 08.10.2019 error on editing the source worklog
        // TODO: marmer 08.10.2019 error on deleting the source worklog
        // TODO: marmer 08.10.2019 error on creating the target worklog (throw error and no change should be performed on source worklog)
    });

});
