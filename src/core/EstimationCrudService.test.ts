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
            expect(EstimationCrudService.updateEstimation({
                issueKey,
                issueSummary: "issueSummary",
                originalEstimate: "originalEstimateValue",
                originalEstimateInMinutes: 42,
                remainingEstimate: "remainingEstimateValue",
                remainingEstimateInMinutes: 24,
            })).rejects.toStrictEqual(new Error("Unexpected response status: 500"))
        });

        it("should update the estimation and return succesfully on the right status code", async () => {
            const issueKey = "issueKey-1234";
            const updateUrl = "http://fancy.com/updateUrl";
            IssueSiteInfos.getIssueUrlForIssueKey = jest.fn().mockImplementation(ik => {
                expect(ik).toEqual(issueKey);
                return updateUrl;
            });

            fetchMock.put(updateUrl, 204);
            await EstimationCrudService.updateEstimation({
                issueKey,
                issueSummary: "issueSummary",
                originalEstimate: "originalEstimateValue",
                originalEstimateInMinutes: 42,
                remainingEstimate: "remainingEstimateValue",
                remainingEstimateInMinutes: 24,
            });

            expect(fetchMock.called((url, opts) => {
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
            })).toBeTruthy();
        });
    });

    describe("getEstimationsForIssueKey()", () => {
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
                                originalEstimateSeconds: 2520,
                                remainingEstimate: "remainingEstimate",
                                remainingEstimateSeconds: 1440,
                                timeSpent: "timeSpent",
                                timeSpentSeconds: 80220,
                            },
                        },
                    },
                ),
                status: 500,
            });

            expect(EstimationCrudService.getEstimationsForIssueKey(issueKey)).rejects.toEqual(Error("Unexpected response status: 500"))
        });

        it("should return the estimations for from the rest api", async () => {
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
                                originalEstimateSeconds: 2520,
                                remainingEstimate: "remainingEstimate",
                                remainingEstimateSeconds: 1440,
                                timeSpent: "timeSpent",
                                timeSpentSeconds: 80220,
                            },
                        },
                    },
                ),
                status: 200,
            });

            expect(EstimationCrudService.getEstimationsForIssueKey(issueKey)).resolves.toStrictEqual({
                issueKey: "issue-200",
                issueSummary: "issueSummary",
                originalEstimate: "originalEstimate",
                originalEstimateInMinutes: 42,
                remainingEstimate: "remainingEstimate",
                remainingEstimateInMinutes: 24,
                timeSpent: "timeSpent",
                timeSpentMinutes: 1337,
            });
        });

        it("should return the estimations for from the rest api with even with undefined values", async () => {
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
                            timetracking: {},
                        },
                    },
                ),
                status: 200,
            });

            expect(EstimationCrudService.getEstimationsForIssueKey(issueKey)).resolves.toStrictEqual({
                issueKey: "issue-200",
                issueSummary: "issueSummary",
                originalEstimate: undefined,
                originalEstimateInMinutes: undefined,
                remainingEstimate: undefined,
                remainingEstimateInMinutes: undefined,
                timeSpent: undefined,
                timeSpentMinutes: undefined,
            });
        });
    });

    it("should return the estimations for from the rest api with even when timetracking is missing", async () => {
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
                    },
                },
            ),
            status: 200,
        });

        expect(EstimationCrudService.getEstimationsForIssueKey(issueKey)).resolves.toStrictEqual({
            issueKey: "issue-200",
            issueSummary: "issueSummary",
            originalEstimate: undefined,
            originalEstimateInMinutes: undefined,
            remainingEstimate: undefined,
            remainingEstimateInMinutes: undefined,
            timeSpent: undefined,
            timeSpentMinutes: undefined,
        });
    });
});
