import deepEqual from "deep-equal";

import fetchMock from "fetch-mock";
import EstimationCrudService, {Estimation} from "./EstimationCrudService";
import IssueSiteInfos from "./IssueSiteInfos";

describe("EstimationCrudService", () => {
    beforeEach(() => {
        fetchMock.reset();
        fetchMock.resetHistory();
        fetchMock.resetBehavior();
    });
    describe("updateEstimation", () => {
        it("should update the estimation and return succesfully on the right status code", () => {
            const issueKey = "issueKey-1234";
            const updateUrl = "updateUrl";
            const updateEstimation: Estimation = {
                issueKey,
                issueSummary: "issueSummary",
                originalEstimate: "originalEstimate",
                originalEstimateInMinutes: 42,
                remainingEstimate: "remainingEstimate",
                remainingEstimateInMinutes: 24,
            };

            IssueSiteInfos.getIssueUrlForIssueKey = jest.fn().mockImplementation(ik => {
                expect(ik).toEqual(issueKey);
                return updateUrl;
            });

            fetchMock.put(updateUrl, 204);

            // TODO: marmer 11.09.2019 go on here

            return EstimationCrudService.updateEstimation(updateEstimation)
                .then(() => {
                    const lastCall = fetchMock.lastCall((url, opts) => url === updateUrl && deepEqual(opts.body, JSON.stringify(updateEstimation)));
                    expect(lastCall).toBeTruthy();
                });

        });
    });

    describe("getEstimationsForIssue()", () => {
        it("should serve an appropriate errormessage on a bad status", () => {
            fetchMock.mock("http://localhost/rest/api/2/issue/issue-200", {
                body: JSON.stringify({
                        fields: {
                            summary: "issueSummary",
                            timetracking: {
                                originalEstimate: "originalEstimate",
                                originalEstimateSeconds: 42,
                                remainingEstimate: "remainingEstimate",
                                remainingEstimateSeconds: 24,
                            },
                        },
                    },
                ),
                status: 500,
            });

            return EstimationCrudService.getEstimationsForIssueKey("issue-200")
                .catch((error) => expect(error).toEqual(Error("Unexpected request status: 500")));
        });

        it("should return the estimations for from the rest api", () => {
            fetchMock.mock("http://localhost/rest/api/2/issue/issue-200", {
                body: JSON.stringify({
                        fields: {
                            summary: "issueSummary",
                            timetracking: {
                                originalEstimate: "originalEstimate",
                                originalEstimateSeconds: 42,
                                remainingEstimate: "remainingEstimate",
                                remainingEstimateSeconds: 24,
                            },
                        },
                    },
                ),
                status: 200,
            });

            return EstimationCrudService.getEstimationsForIssueKey("issue-200")
                .then((result) =>
                    deepEqual(result,
                        {
                            issueKey: "issue-200",
                            issueSummary: "issueSummary",
                            originalEstimate: "originalEstimate",
                            originalEstimateInMinutes: 42,
                            remainingEstimate: "remainingEstimate",
                            remainingEstimateInMinutes: 24,
                        },
                    ));
        });
    });
});
