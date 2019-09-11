import fetchMock from "fetch-mock";
import IssueSiteInfos from "./IssueSiteInfos";
import WorklogService, {Worklog} from "./WorklogService";

describe("WorklogService", () => {
    beforeEach(() => {
        fetchMock.restore();
    });

    describe("getSummedWorklogsByUser", () => {
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
                            timeSpentSeconds: 480,
                        },
                        {
                            author: {
                                displayName: "Jery Mouse",
                            },
                            timeSpent: "7h",
                            timeSpentSeconds: 420,
                        },
                        {
                            author: {
                                displayName: "Tom Tomcat",
                            },
                            timeSpent: "1w 3d",
                            timeSpentSeconds: 3840,
                        },
                    ],
                }),
            });

            WorklogService.getSummedWorklogsByUser()
                .then(result => {
                    const expectedResult: Worklog[] = [
                        {
                            author: {
                                displayName: "Jery Mouse",
                            },
                            timeSpentInMinutes: 420,
                        },
                        {
                            author: {
                                displayName: "Tom Tomcat",
                            },
                            timeSpentInMinutes: 4320,
                        },
                    ];
                    expect(result).toStrictEqual(expectedResult);
                })
                .catch(reason => fail(reason));
        });
    });
});
