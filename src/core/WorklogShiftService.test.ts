import JiraTimeService from "./JiraTimeService";
import {Worklog} from "./WorklogService";
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

        // TODO: marmer 08.10.2019 it should do nothing when someone tries to shift zero time
        // TODO: marmer 08.10.2019 successful full shift - source deleted
        // TODO: marmer 08.10.2019 successful full shift - target created with correct time
        // TODO: marmer 08.10.2019 successful part shift - source edited with correct time
        // TODO: marmer 08.10.2019 successful part shift - target created with correct time
        // TODO: marmer 08.10.2019 error on editing the source worklog
        // TODO: marmer 08.10.2019 error on deleting the source worklog
        // TODO: marmer 08.10.2019 error on creating the target worklog
    });

});
