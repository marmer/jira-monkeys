import deepEqual from "deep-equal";

import fetchMock from "fetch-mock";
import EstimationCrudService from "./EstimationCrudService";
import IssueSiteInfos from "./IssueSiteInfos";

describe("EstimationCrudService", () => {
    beforeEach(() => {
        fetchMock.reset();
        jest.resetAllMocks();
    });
    describe("updateEstimation", () => {
        it("should fail with an appropriate error when the server responds with an unexpected status", () => {
            const issueKey = "issueKey-1234";
            const updateUrl = "http://fancy.com/updateUrl";
            IssueSiteInfos.getIssueUrlForIssueKey = jest.fn().mockImplementation(ik => {
                expect(ik).toEqual(issueKey);
                return updateUrl;
            });

            fetchMock.put(updateUrl, 500);
            return EstimationCrudService.updateEstimation({
                issueKey,
                issueSummary: "issueSummary",
                originalEstimate: "originalEstimateValue",
                originalEstimateInMinutes: 42,
                remainingEstimate: "remainingEstimateValue",
                remainingEstimateInMinutes: 24,
            }).catch(result => expect(result).toEqual(new Error("Unexpected request status: 500")));
        });

        it("should update the estimation and return succesfully on the right status code", () => {
            const issueKey = "issueKey-1234";
            const updateUrl = "http://fancy.com/updateUrl";
            IssueSiteInfos.getIssueUrlForIssueKey = jest.fn().mockImplementation(ik => {
                expect(ik).toEqual(issueKey);
                return updateUrl;
            });

            fetchMock.put(updateUrl, 204);

            return EstimationCrudService.updateEstimation({
                issueKey,
                issueSummary: "issueSummary",
                originalEstimate: "originalEstimateValue",
                originalEstimateInMinutes: 42,
                remainingEstimate: "remainingEstimateValue",
                remainingEstimateInMinutes: 24,
            })
                .then(() => {
                    const called = fetchMock.called((url, opts) => {
                        return url === updateUrl &&
                            opts.body === JSON.stringify({
                                    fields: {
                                        timetracking: {
                                            originalEstimate: "originalEstimateValue",
                                            remainingEstimate: "remainingEstimateValue",
                                        },
                                    },
                                },
                            );
                    });
                    expect(called).toBeTruthy();
                });
        });
    });

    describe("getEstimationsForIssue()", () => {
        it("should serve an appropriate errormessage on a bad status", () => {
            const issueKey = "issue-200";
            const updateUrl = "http://fancy.com/updateUrl";
            IssueSiteInfos.getIssueUrlForIssueKey = jest.fn().mockImplementation(ik => {
                expect(ik).toEqual(issueKey);
                return updateUrl;
            });
            fetchMock.mock(updateUrl, {
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

            return EstimationCrudService.getEstimationsForIssueKey(issueKey)
                .catch((error) => expect(error).toEqual(Error("Unexpected request status: 500")));
        });

        it("should return the estimations for from the rest api", () => {
            const issueKey = "issue-200";
            const updateUrl = "http://fancy.com/updateUrl";
            IssueSiteInfos.getIssueUrlForIssueKey = jest.fn().mockImplementation(ik => {
                expect(ik).toEqual(issueKey);
                return updateUrl;
            });
            fetchMock.mock(updateUrl, {
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

            return EstimationCrudService.getEstimationsForIssueKey(issueKey)
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
