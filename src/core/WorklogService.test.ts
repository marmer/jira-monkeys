import fetchMock from "fetch-mock";
import IssueSiteInfos from "./IssueSiteInfos";
import WorklogService, {Worklog} from "./WorklogService";

describe("WorklogService", () => {
    beforeEach(() => {
        fetchMock.restore();
    });

    describe("getSummedWorklogsByUser", () => {
        it("should throw an appropriate error witht he status code on an unexpected status code", () => {
            IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue("isskey-1");
            IssueSiteInfos.getWorklogUrlForIssueKey = jest.fn().mockImplementation(issueKey => {
                if (issueKey !== "isskey-1") {
                    fail("Request for wrong issue key");
                }
                return "worklogUrl";
            });
            const unexpectedStatusCode = 404;
            fetchMock.get("worklogUrl", {
                status: unexpectedStatusCode,
            });

            return WorklogService.getSummedWorklogsByUser()
                .catch(reason => expect(reason).toEqual(new Error("Unexpected request status: " + unexpectedStatusCode)));
        });

        it("should return and summed list of worklogs gruped by authors displayname and sorted by display name", () => {
            IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue("isskey-1");
            IssueSiteInfos.getWorklogUrlForIssueKey = jest.fn().mockImplementation(issueKey => {
                if (issueKey !== "isskey-1") {
                    fail("Request for wrong issue key");
                }
                return "worklogUrl";
            });

            fetchMock.get("worklogUrl", {
                status: 200,
                body: JSON.stringify({
                    worklogs: [
                        {
                            author: {
                                displayName: "Tom Tomcat",
                            },
                            timeSpent: "1d",
                            timeSpentSeconds: 28800,
                        },
                        {
                            author: {
                                displayName: "Jery Mouse",
                            },
                            timeSpent: "7h",
                            timeSpentSeconds: 25200,
                        },
                        {
                            author: {
                                displayName: "Pet Owner",
                            },
                            timeSpent: "1m",
                            timeSpentSeconds: 60,
                        },
                        {
                            author: {
                                displayName: "Tom Tomcat",
                            },
                            timeSpent: "1w 3d",
                            timeSpentSeconds: 230400,
                        },
                        {
                            author: {
                                displayName: "Jery Mouse",
                            },
                            timeSpent: "7h",
                            timeSpentSeconds: 25200,
                        },
                    ],
                }),
            });

            return WorklogService.getSummedWorklogsByUser()
                .then(result => {
                    const expectedResult: Worklog[] = [
                        {
                            author: {
                                displayName: "Jery Mouse",
                            },
                            timeSpentInMinutes: 840,
                        },
                        {
                            author: {
                                displayName: "Pet Owner",
                            },
                            timeSpentInMinutes: 1,
                        },
                        {
                            author: {
                                displayName: "Tom Tomcat",
                            },
                            timeSpentInMinutes: 4320,
                        },
                    ];
                    expect(result).toStrictEqual(expectedResult);
                });
        });
    });
});
