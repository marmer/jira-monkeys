import EstimationService from "./EstimationService";

import fetchMock from "fetch-mock"
import deepEqual from "deep-equal";

describe("something", () => {
    beforeEach(() => {
        fetchMock.restore()
    });

    it('should serve an appropriate errormessage on a bad status', () => {
        fetchMock.mock('http://localhost/rest/api/2/issue/issue-200', {
            status: 500,
            body: JSON.stringify({
                    "fields": {
                        "summary": "issueSummary",
                        "timetracking": {
                            "originalEstimate": "originalEstimate",
                            "remainingEstimate": "remainingEstimate",
                            "originalEstimateSeconds": 42,
                            "remainingEstimateSeconds": 24
                        }
                    }
                }
            )
        });

        EstimationService.getEstimationsForIssue("issue-200")
            .then(result =>
                fail("No result should be served if no success status is served"))
            .then(error => expect(error).toBe("Unexpected request status: 500"))
    });
    it('should return the estimations for from the rest api', () => {

        fetchMock.mock('http://localhost/rest/api/2/issue/issue-200', {
            status: 200,
            body: JSON.stringify({
                    "fields": {
                        "summary": "issueSummary",
                        "timetracking": {
                            "originalEstimate": "originalEstimate",
                            "remainingEstimate": "remainingEstimate",
                            "originalEstimateSeconds": 42,
                            "remainingEstimateSeconds": 24
                        }
                    }
                }
            )
        });

        EstimationService.getEstimationsForIssue("issue-200")
            .then(result =>
                deepEqual(result,
                    {
                        issueKey: "issue-200",
                        issueSummary: "issueSummary",
                        originalEstimate: "originalEstimate",
                        originalEstimateInMinutes: 42,
                        remainingEstimate: "remainingEstimate",
                        remainingEstimateInMinutes: 24
                    }
                ))
            .catch(reason => fail(reason))
    });
});