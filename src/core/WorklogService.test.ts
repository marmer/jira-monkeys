import fetchMock from "fetch-mock";
import IssueSiteInfos from "./IssueSiteInfos";
import JiraTimeService from "./JiraTimeService";
import UserService from "./UserService";
import WorklogService, {Worklog} from "./WorklogService";

describe("WorklogService", () => {
    const worklogBase: Worklog = {
        issueId: "42",
        author: {
            name: "real.me",
            displayName: "Me",
        },
        timeSpentInMinutes: 1337,
        started: "2000-01-01T00:00:00.000+0000",
        id: "43",
        comment: "did something",
    };

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

            expect(WorklogService.getWorklogsForCurrentIssueAndUser()).rejects.toStrictEqual(new Error("Unexpected response status: " + unexpectedStatusCode));

        });

        it("should only return worklogs for the current user", async () => {
            const currentUserName = "tom.cat";
            const currentIssueKey = "isskey-1";
            const worklogUrl = "worklogUrl";

            IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentIssueKey);
            UserService.getCurrentUserName = jest.fn().mockResolvedValue(currentUserName);
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
                            issueId: "12",
                        }, {
                            author: {
                                displayName: "Jerry Mouse",
                                name: "jerry.mouse",
                            },
                            timeSpentSeconds: 120,
                            started: "2020-09-02T16:03:00.000+020",
                            id: "second",
                            comment: "sleeping",
                            issueId: "23",
                        }, {
                            author: {
                                displayName: "Tom Tomcat",
                                name: currentUserName,
                            },
                            timeSpentSeconds: 180,
                            started: "2021-09-02T16:03:00.000+020",
                            id: "third",
                            comment: "curing the pain of Jerry's trap",
                            issueId: "34",
                        },
                    ],
                }),
            });

            expect(WorklogService.getWorklogsForCurrentIssueAndUser()).resolves.toStrictEqual([
                {
                    author: {
                        displayName: "Tom Tomcat",
                        name: currentUserName,
                    },
                    timeSpentInMinutes: 1,
                    started: "2019-09-02T16:03:00.000+020",
                    id: "first",
                    comment: "hunting for Jerry",
                    issueId: "12",
                }, {
                    author: {
                        displayName: "Tom Tomcat",
                        name: currentUserName,
                    },
                    timeSpentInMinutes: 3,
                    started: "2021-09-02T16:03:00.000+020",
                    id: "third",
                    comment: "curing the pain of Jerry's trap",
                    issueId: "34",
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

            expect(WorklogService.getSummedWorklogsByUser()).rejects.toStrictEqual(new Error("Unexpected response status: " + unexpectedStatusCode));
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

            expect(WorklogService.getSummedWorklogsByUser()).resolves.toStrictEqual([
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
            ]);
        });
    });

    describe("createWorklog", () => {
        it("should resolve successfull with the right status code", async () => {
            const worklogCreateUrl = "/someWorklogUrl";
            fetchMock.post(worklogCreateUrl, {
                status: 201,
            });

            const issueKey = "niceIssueKey-123";
            const timeSpentInMinutes = 42;
            const started = "startedString";
            const comment = "fancyComment";

            const timeSpent = "timeToShiftAsJiraTimeString";

            JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(tsm => {
                if (tsm !== timeSpentInMinutes) {
                    fail("unexpected input " + tsm);
                }
                return timeSpent;
            });

            IssueSiteInfos.getWorklogUrlForIssueKey = jest.fn().mockImplementation(ik => {
                if (ik !== issueKey) {
                    fail("Request for wrong issue key");
                }
                return worklogCreateUrl;
            });

            await expect(WorklogService.createWorklog({
                issueKey,
                timeSpentInMinutes,
                started,
                comment,
            })).resolves.toBeUndefined();

            expect(fetchMock.called((url, opts) => {
                return url === worklogCreateUrl &&
                    opts.body === JSON.stringify({
                            comment,
                            timeSpent,
                            started,
                        },
                    );
            })).toBeTruthy();
        });

        it("should reject at a bad status code", async () => {
            const worklogCreateUrl = "/someWorklogUrl";
            fetchMock.post(worklogCreateUrl, {
                status: 418,
            });

            const issueKey = "niceIssueKey-123";
            const timeSpentInMinutes = 42;
            const started = "startedString";
            const comment = "fancyComment";

            const timeSpent = "timeToShiftAsJiraTimeString";

            JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(tsm => {
                if (tsm !== timeSpentInMinutes) {
                    fail("unexpected input " + tsm);
                }
                return timeSpent;
            });

            IssueSiteInfos.getWorklogUrlForIssueKey = jest.fn().mockImplementation(ik => {
                if (ik !== issueKey) {
                    fail("Request for wrong issue key");
                }
                return worklogCreateUrl;
            });

            await expect(WorklogService.createWorklog({
                issueKey,
                timeSpentInMinutes,
                started,
                comment,
            })).rejects.toStrictEqual(new Error("Unexpected status code. Creation of worklog probably not sucecssful"));

        });
        it("should reject at unsuccessful fetch with an appropriate errormessage", async () => {
            const worklogCreateUrl = "/someWorklogUrl";
            fetchMock.post(worklogCreateUrl, {
                status: 418,
                throws: new Error("ding ding ding"),
            });

            const issueKey = "niceIssueKey-123";
            const timeSpentInMinutes = 42;
            const started = "startedString";
            const comment = "fancyComment";

            const timeSpent = "timeToShiftAsJiraTimeString";

            JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(tsm => {
                if (tsm !== timeSpentInMinutes) {
                    fail("unexpected input " + tsm);
                }
                return timeSpent;
            });

            IssueSiteInfos.getWorklogUrlForIssueKey = jest.fn().mockImplementation(ik => {
                if (ik !== issueKey) {
                    fail("Request for wrong issue key");
                }
                return worklogCreateUrl;
            });

            await expect(WorklogService.createWorklog({
                issueKey,
                timeSpentInMinutes,
                started,
                comment,
            })).rejects.toStrictEqual(new Error("Communication error: Worklog creation failed"));

        });
    });

    describe("deleteWorklog", () => {
        it("should resolve successfull with the right status code", async () => {
            const worklogDeleteUrl = "/someWorklogUrl";
            fetchMock.delete(worklogDeleteUrl, {
                status: 204,
            });

            const worklog = {...worklogBase};

            IssueSiteInfos.getWorklogModifyUrlByWorklog = jest.fn().mockImplementation(wl => {
                if (wl !== worklog) {
                    fail("Request for wrong worklog");
                }
                return worklogDeleteUrl;
            });

            expect(WorklogService.deleteWorklog(worklog)).resolves.toBeUndefined();

            expect(fetchMock.called((url, opts) => {
                return url === worklogDeleteUrl;
            })).toBeTruthy();
        });

        it("should reject at a bad status code", async () => {
            const worklogDeleteUrl = "/someWorklogUrl";
            fetchMock.delete(worklogDeleteUrl, {
                status: 418,
            });

            const worklog = {...worklogBase};

            IssueSiteInfos.getWorklogModifyUrlByWorklog = jest.fn().mockImplementation(wl => {
                if (wl !== worklog) {
                    fail("Request for wrong worklog");
                }
                return worklogDeleteUrl;
            });

            await expect(WorklogService.deleteWorklog(worklog)).rejects.toStrictEqual(new Error("Unexpected status code. Deletion of worklog probably not sucecssful"));
        });

        it("should reject at unsuccessful fetch with an appropriate errormessage", async () => {
            const worklogDeleteUrl = "/someWorklogUrl";
            fetchMock.delete(worklogDeleteUrl, {
                status: 204,
                throws: new Error("dong dong dong"),
            });

            const worklog = {...worklogBase};

            IssueSiteInfos.getWorklogModifyUrlByWorklog = jest.fn().mockImplementation(wl => {
                if (wl !== worklog) {
                    fail("Request for wrong worklog");
                }
                return worklogDeleteUrl;
            });

            await expect(WorklogService.deleteWorklog(worklog)).rejects.toStrictEqual(new Error("Communication error: Worklog deletion failed"));
        });
    });

    describe("updateWorklog()", () => {
        it("should resolve successfull with the right status code", async () => {
            const worklogUpdateUrl = "/someWorklogUrl";
            fetchMock.put(worklogUpdateUrl, {
                status: 204,
            });

            const worklog = {...worklogBase};
            const timeSpent = "timeSpentJiraString";

            IssueSiteInfos.getWorklogModifyUrlByWorklog = jest.fn().mockImplementation(wl => {
                if (wl !== worklog) {
                    fail("Request for wrong worklog");
                }
                return worklogUpdateUrl;
            });

            JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(tsm => {
                if (tsm !== worklog.timeSpentInMinutes) {
                    fail("unexpected input " + tsm);
                }
                return timeSpent;
            });

            expect(WorklogService.updateWorklog(worklog)).resolves.toBeUndefined();

            expect(fetchMock.called((url, opts) => {
                return url === worklogUpdateUrl &&
                    opts.body === JSON.stringify({
                        comment: worklog.comment,
                        timeSpent,
                        started: worklog.started,
                    });
            })).toBeTruthy();
        });

        it("should reject at a bad status code", async () => {
            const worklogUpdateUrl = "/someWorklogUrl";
            fetchMock.put(worklogUpdateUrl, {
                status: 418,
            });

            const worklog = {...worklogBase};

            IssueSiteInfos.getWorklogModifyUrlByWorklog = jest.fn().mockReturnValue(worklogUpdateUrl);

            await expect(WorklogService.updateWorklog(worklog)).rejects.toStrictEqual(new Error("Unexpected status code. Updating of worklog probably not sucecssful"));
        });

        it("should reject at unsuccessful fetch with an appropriate errormessage", async () => {
            const worklogUpdateUrl = "/someWorklogUrl";
            fetchMock.put(worklogUpdateUrl, {
                status: 204,
                throws: new Error("tic tric trac"),
            });

            const worklog = {...worklogBase};

            IssueSiteInfos.getWorklogModifyUrlByWorklog = jest.fn().mockReturnValue(worklogUpdateUrl);

            await expect(WorklogService.updateWorklog(worklog)).rejects.toStrictEqual(new Error("Communication error: Worklog updating failed"));
        });
    });
});
