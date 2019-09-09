import JiraTimeFormatter from "./JiraTimeService";


describe(JiraTimeFormatter.name + "." + JiraTimeFormatter.minutesToJiraFormat.name, () => {
    [
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
            expect(JiraTimeFormatter.minutesToJiraFormat(parameter.timeSpentInMinutes)).toBe(parameter.expectedJiraString)
        });
    });
});

describe(JiraTimeFormatter.name + "." + JiraTimeFormatter.isValidJiraFormat.name, () => {
    [
        {input: "1m", isJiraFormat: true},
        {input: "1h", isJiraFormat: true},
        {input: "1d", isJiraFormat: true},
        {input: "1w", isJiraFormat: true},
        {input: " 1h 1m 1w 1d", isJiraFormat: true},
        {input: "   1h \t 1m   1w   1d   ", isJiraFormat: true},
        {input: "117", isJiraFormat: false},
        {input: "bla", isJiraFormat: false},
        {input: "bla", isJiraFormat: false},
        {input: "8823m", isJiraFormat: true},
        {input: " 1h 1mimimi 1w 1d", isJiraFormat: false},

    ].forEach(parameter => {
        it('should ' + parameter.input + ' be valid? ===' + parameter.isJiraFormat, () => {
            expect(JiraTimeFormatter.isValidJiraFormat(parameter.input))
                .toBe(parameter.isJiraFormat);
        });
    })
});

describe(JiraTimeFormatter.name + "." + JiraTimeFormatter.jiraFormatToMinutes.name, () => {
    [
        {jiraString: "0m", expectedTimeSpentInMinutes: 0},
        {jiraString: "59m", expectedTimeSpentInMinutes: 59},
        {jiraString: "1h", expectedTimeSpentInMinutes: 60},
        {jiraString: "7h 59m", expectedTimeSpentInMinutes: 479},
        {jiraString: "1d", expectedTimeSpentInMinutes: 480},
        {jiraString: "4d 7h 59m", expectedTimeSpentInMinutes: 2399},
        {jiraString: "1w", expectedTimeSpentInMinutes: 2400},
        {jiraString: "1w 4d 7h 59m", expectedTimeSpentInMinutes: 4799},
        {jiraString: "2w", expectedTimeSpentInMinutes: 4800},
        {jiraString: "1w 59m", expectedTimeSpentInMinutes: 2459},
    ].forEach(parameter => {
        it('should transform the jira String' + parameter.jiraString + ' into its numeric value in minutes "' + parameter.jiraString + '"', () => {
            expect(JiraTimeFormatter.jiraFormatToMinutes(parameter.jiraString)).toBe(parameter.expectedTimeSpentInMinutes)
        });
    });
});