import jiraFormat from "./jiraFormat";

describe("timeSpentInMinutes", () => {
    const parameters = [
        {timeSpentInMinutes: 0, expectedJiraString: "0m"},
        {timeSpentInMinutes: 59, expectedJiraString: "59m"},
        {timeSpentInMinutes: 60, expectedJiraString: "1h"},
        {timeSpentInMinutes: 479, expectedJiraString: "7h 59m"},
        {timeSpentInMinutes: 480, expectedJiraString: "1d"},
        {timeSpentInMinutes: 2399, expectedJiraString: "4d 7h 59m"},
        {timeSpentInMinutes: 2400, expectedJiraString: "1w"},
        {timeSpentInMinutes: 4799, expectedJiraString: "1w 4d 7h 59m"},
        {timeSpentInMinutes: 4800, expectedJiraString: "2w"},
        {timeSpentInMinutes: 2459, expectedJiraString: "1w 59m"},
        {timeSpentInMinutes: -4799, expectedJiraString: "1w 4d 7h 59m"}
    ].forEach(parameter => {
        it('should split transform ' + parameter.timeSpentInMinutes + ' into the jira string "' + parameter.expectedJiraString + '"', () => {
            expect(jiraFormat(parameter.timeSpentInMinutes)).toBe(parameter.expectedJiraString)
        });
    })
});