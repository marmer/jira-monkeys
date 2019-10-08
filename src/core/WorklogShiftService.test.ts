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
    });

    // TODO: marmer 08.10.2019 successful full shift - source deleted
    // TODO: marmer 08.10.2019 successful full shift - target created with correct time
    // TODO: marmer 08.10.2019 successful part shift - source edited with correct time
    // TODO: marmer 08.10.2019 successful part shift - target created with correct time
    // TODO: marmer 08.10.2019 error on editing the source worklog
    // TODO: marmer 08.10.2019 error on deleting the source worklog
    // TODO: marmer 08.10.2019 error on creating the target worklog
});
