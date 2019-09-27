import EstimationCrudService, {Estimation} from "./EstimationCrudService";
import EstimationFixService from "./EstimationFixService";
import JiraTimeService from "./JiraTimeService";

describe("EstimationFixService", () => {
    const minutesToJiraFormat = (minutes: number) => minutes + "m";

    JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(minutesToJiraFormat);

    describe("fixEstimationForIssue", () => {

        const baseEstimation: Estimation = {
            issueSummary: "some Summary",
            issueKey: "ISSUE-1234",
        };

        ([
            {
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: "5m",
                    remainingEstimateInMinutes: 5,
                    timeSpent: "8m",
                    timeSpentMinutes: 8,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: "10m",
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(2),
                    remainingEstimateInMinutes: 2,
                    timeSpent: "8m",
                    timeSpentMinutes: 8,
                },
            },
        ] as [{ estimationToFix: Estimation, fixedEstimation: Estimation }])
            .map(({estimationToFix, fixedEstimation}) => {
                it("should shift estimations for " + estimationToFix + " to " + fixedEstimation, async () => {
                    EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                        async issueKey => {
                            if (issueKey !== estimationToFix.issueKey) {
                                fail("Unexpected issue to load: " + issueKey);
                            }
                            return estimationToFix;
                        },
                    );
                    EstimationCrudService.updateEstimation = jest.fn();
                    await EstimationFixService.fixEstimationForIssue(estimationToFix.issueKey);

                    expect(EstimationCrudService.updateEstimation).toBeCalledWith(fixedEstimation);

                    // TODO: marmer 26.09.2019 go on here with a "few" more possibilities
                });
            });
        // TODO: marmer 27.09.2019 add negative cases
        // TODO: marmer 27.09.2019 add tests with nothing todo
    });
});
