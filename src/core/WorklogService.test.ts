import fetchMock from "fetch-mock";
import IssueSiteInfos from "./IssueSiteInfos";
import WorklogService, {Worklog, WorklogSumByUser} from "./WorklogService";

describe("WorklogService", () => {
    beforeEach(() => {
        fetchMock.restore();
    });

    describe("getWorklogsForCurrentIssueAndUser", () => {
        it("should throw an appropriate error with the status code on an unexpected status code", () => {
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

            return WorklogService.getWorklogsForCurrentIssueAndUser()
                .catch(reason => expect(reason).toEqual(new Error("Unexpected request status: " + unexpectedStatusCode)));
        });

        it("should only return worklogs for the current user", async () => {
            const currentUserName = "tom.cat";
            const currentIssueKey = "isskey-1";
            const worklogUrl = "worklogUrl";

            IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentIssueKey);
            IssueSiteInfos.getCurrentUserName = jest.fn().mockRejectedValue(Promise.resolve(currentUserName));
            IssueSiteInfos.getWorklogUrlForIssueKey = jest.fn().mockImplementation(issueKey => {
                if (issueKey !== currentIssueKey) {
                    fail("Request for wrong issue key");
                }
                return worklogUrl;
            });
            fetchMock.get(worklogUrl, {
                status: 200,
                body: JSON.stringify({
                    worklogs: [
                        {
                            author: {
                                displayName: "Tom Tomcat",
                                name: currentUserName,
                            },
                            timeSpentSeconds: 60,
                            started: "2019-09-02T16:03:00.000+020",
                            id: "first",
                            comment: "hunting for Jerry",
                        }, {
                            author: {
                                displayName: "Jerry Mouse",
                                name: "jerry.mouse",
                            },
                            timeSpentSeconds: 120,
                            started: "2020-09-02T16:03:00.000+020",
                            id: "second",
                            comment: "sleeping",
                        }, {
                            author: {
                                displayName: "Tom Tomcat",
                                name: currentUserName,
                            },
                            timeSpentSeconds: 180,
                            started: "2021-09-02T16:03:00.000+020",
                            id: "third",
                            comment: "curing the pain of Jerry's trap",
                        },
                    ],
                }),
            });

            const worklogs = await WorklogService.getWorklogsForCurrentIssueAndUser();

            expect(worklogs).toStrictEqual([
                {
                    author: {
                        displayName: "Tom Tomcat",
                        name: currentUserName,
                    },
                    timeSpentInMinutes: 1,
                    started: "2019-09-02T16:03:00.000+020",
                    id: "first",
                    comment: "hunting for Jerry",
                }, {
                    author: {
                        displayName: "Tom Tomcat",
                        name: currentUserName,
                    },
                    timeSpentInMinutes: 3,
                    started: "2021-09-02T16:03:00.000+020",
                    id: "third",
                    comment: "curing the pain of Jerry's trap",
                },
            ] as Worklog[]);
        });
    });
    describe("getSummedWorklogsByUser", () => {
        it("should throw an appropriate error with the status code on an unexpected status code", () => {
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
                    const expectedResult: WorklogSumByUser[] = [
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
