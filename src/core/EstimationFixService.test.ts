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

        it("should shift estimations correctly", async () => {
            const estimationToFix: Estimation = {
                ...baseEstimation,
                originalEstimate: "10m",
                originalEstimateInMinutes: 10,
                remainingEstimate: "5m",
                remainingEstimateInMinutes: 5,
                timeSpent: "8m",
                timeSpentMinutes: 8,
            };

            const fixedEstimation: Estimation = {
                ...baseEstimation,
                originalEstimate: "10m",
                originalEstimateInMinutes: 10,
                remainingEstimate: minutesToJiraFormat(2),
                remainingEstimateInMinutes: 2,
                timeSpent: "8m",
                timeSpentMinutes: 8,
            };

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
});
