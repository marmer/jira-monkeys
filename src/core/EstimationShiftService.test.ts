import fetchMock from "fetch-mock";
import EstimationCrudService, {Estimation} from "./EstimationCrudService";
import EstimationShiftService from "./EstimationShiftService";

describe("EstimationShiftService", () => {
    const underTest = EstimationShiftService;

    beforeEach(() => {
        fetchMock.restore();
    });

    describe("shiftEstimation", () => {
        const someEstimation: Estimation = {
            remainingEstimate: "1h",
            originalEstimate: "1d",
            issueKey: "someIssue-1337",
            remainingEstimateInMinutes: 24,
            originalEstimateInMinutes: 42,
            issueSummary: "what a nice issue",
        };

        it("should be possible to shift time from one ticket to another if there is enough budget on the source ticket", () => {
            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                (ik) => {
                    expect(ik).toMatch(/ISSUE-123/i);
                    return Promise.resolve(someEstimation);
                });

        });

        it("should simply return the issues if they are equal even in different cases", () => {
            EstimationCrudService.getEstimationsForIssueKey = (ik) => {
                expect(ik).toMatch(/ISSUE-123/i);
                return Promise.resolve(someEstimation);
            };

            return underTest.shiftEstimation({
                timeToShiftAsJiraString: "5d",
                targetIssueKey: "IssUe-123",
                sourceIssueKey: "iSSuE-123",
            }).then(result => {
                expect(result.sourceEstimation).toStrictEqual(someEstimation);
                expect(result.targetEstimation).toStrictEqual(someEstimation);
            });
        });
    });
});
