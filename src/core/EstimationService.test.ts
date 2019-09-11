import deepEqual from "deep-equal";

import fetchMock from "fetch-mock";
import EstimationCrudService from "./EstimationCrudService";

describe("EstimationCrudService", () => {
    beforeEach(() => {
        fetchMock.restore();
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

            return EstimationCrudService.getEstimationsForIssue("issue-200")
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

            return EstimationCrudService.getEstimationsForIssue("issue-200")
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
