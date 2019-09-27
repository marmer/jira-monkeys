import EstimationCrudService, {Estimation} from "./EstimationCrudService";
import EstimationFixService from "./EstimationFixService";
import JiraTimeService from "./JiraTimeService";

describe("EstimationFixService", () => {
    const minutesToJiraFormat = (minutes: number) => minutes + "m";

    JiraTimeService.minutesToJiraFormat = jest.fn().mockImplementation(minutesToJiraFormat);

    describe("fixEstimationForIssue", () => {

        const baseEstimation: Estimation = {
            issueSummary: "some Summary",
            issueKey: "ISSUE-1234",
        };

        ([
            {
                description: "too much remaining",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(5),
                    remainingEstimateInMinutes: 5,
                    timeSpent: "8m",
                    timeSpentMinutes: 8,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(2),
                    remainingEstimateInMinutes: 2,
                    timeSpent: "8m",
                    timeSpentMinutes: 8,
                },
            }, {
                description: "not enough remaining",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(5),
                    remainingEstimateInMinutes: 5,
                    timeSpent: "2m",
                    timeSpentMinutes: 2,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(8),
                    remainingEstimateInMinutes: 8,
                    timeSpent: "2m",
                    timeSpentMinutes: 2,
                },
            }, {
                description: "more time spent than estimated",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(5),
                    remainingEstimateInMinutes: 5,
                    timeSpent: "50m",
                    timeSpentMinutes: 50,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(0),
                    remainingEstimateInMinutes: 0,
                    timeSpent: "50m",
                    timeSpentMinutes: 50,
                },
            }, {
                description: "undefined remaining",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: undefined,
                    remainingEstimateInMinutes: undefined,
                    timeSpent: "2m",
                    timeSpentMinutes: 2,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(8),
                    remainingEstimateInMinutes: 8,
                    timeSpent: "2m",
                    timeSpentMinutes: 2,
                },
            }, {
                description: "undefined timespent",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(3),
                    remainingEstimateInMinutes: 3,
                    timeSpent: undefined,
                    timeSpentMinutes: undefined,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(10),
                    remainingEstimateInMinutes: 10,
                    timeSpent: undefined,
                    timeSpentMinutes: undefined,
                },
            }, {
                description: "undefined original",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: undefined,
                    originalEstimateInMinutes: undefined,
                    remainingEstimate: minutesToJiraFormat(3),
                    remainingEstimateInMinutes: 3,
                    timeSpent: minutesToJiraFormat(2),
                    timeSpentMinutes: 2,
                },
                fixedEstimation: {
                    ...baseEstimation,
                    originalEstimate: undefined,
                    originalEstimateInMinutes: undefined,
                    remainingEstimate: minutesToJiraFormat(0),
                    remainingEstimateInMinutes: 0,
                    timeSpent: minutesToJiraFormat(2),
                    timeSpentMinutes: 2,
                },
            },
        ] as Array<{ description: string, estimationToFix: Estimation, fixedEstimation: Estimation }>)
            .map(({description, estimationToFix, fixedEstimation}) => {
                it("should shift estimation when there is " + description, async () => {
                    EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                        async issueKey => {
                            if (issueKey !== estimationToFix.issueKey) {
                                fail("Unexpected issue to load: " + issueKey);
                            }
                            return estimationToFix;
                        },
                    );
                    EstimationCrudService.updateEstimation = jest.fn();
                    await EstimationFixService.fixEstimationForIssue(estimationToFix.issueKey);

                    expect(EstimationCrudService.updateEstimation).toBeCalledWith(fixedEstimation);
                });
            });

        ([
            {
                description: "a correct non zero estimation",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: minutesToJiraFormat(3),
                    remainingEstimateInMinutes: 3,
                    timeSpent: minutesToJiraFormat(7),
                    timeSpentMinutes: 7,
                },
            }, {
                description: "a correct zero estimation",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: minutesToJiraFormat(10),
                    originalEstimateInMinutes: 10,
                    remainingEstimate: undefined,
                    remainingEstimateInMinutes: undefined,
                    timeSpent: minutesToJiraFormat(10),
                    timeSpentMinutes: 10,
                },
            }, {
                description: "neither an original nor an remaining estimation",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: undefined,
                    originalEstimateInMinutes: undefined,
                    remainingEstimate: undefined,
                    remainingEstimateInMinutes: undefined,
                    timeSpent: minutesToJiraFormat(10),
                    timeSpentMinutes: 10,
                },
            }, {
                description: "nor kind of estimation",
                estimationToFix: {
                    ...baseEstimation,
                    originalEstimate: undefined,
                    originalEstimateInMinutes: undefined,
                    remainingEstimate: undefined,
                    remainingEstimateInMinutes: undefined,
                    timeSpent: undefined,
                    timeSpentMinutes: undefined,
                },
            },
        ] as Array<{ description: string, estimationToFix: Estimation }>)
            .map(({description, estimationToFix}) => {
                it("should shift no shift estimation when there has " + description, async () => {
                    EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                        async issueKey => {
                            if (issueKey !== estimationToFix.issueKey) {
                                fail("Unexpected issue to load: " + issueKey);
                            }
                            return estimationToFix;
                        },
                    );
                    EstimationCrudService.updateEstimation = jest.fn();
                    await EstimationFixService.fixEstimationForIssue(estimationToFix.issueKey);

                    expect(EstimationCrudService.updateEstimation).not.toBeCalled();
                });
            });

        it("should reject with an appropriate errormessage when it's not possible to load the necessary information to fix anything", async () => {
            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockRejectedValue(new Error("Well, that's not nice"));
            EstimationCrudService.updateEstimation = jest.fn();

            try {
                await EstimationFixService.fixEstimationForIssue("annyIssueKey-1234");
                fail("it's execution was not expected to be be successful at all");
            } catch (e) {
                expect(e).toStrictEqual(new Error("Error while loading the estimation to fix"));
                expect(EstimationCrudService.updateEstimation).not.toBeCalled();
            }
        });

        it("should reject with an appropriate errormessage when it's not possible to update the necessary information to fix anything", async () => {
            const estimationToFix = {
                ...baseEstimation,
                originalEstimate: minutesToJiraFormat(10),
                originalEstimateInMinutes: 10,
                remainingEstimate: minutesToJiraFormat(5),
                remainingEstimateInMinutes: 5,
                timeSpent: "8m",
                timeSpentMinutes: 8,
            };

            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                async issueKey => {
                    if (issueKey !== estimationToFix.issueKey) {
                        fail("Unexpected issue to load: " + issueKey);
                    }
                    return estimationToFix;
                },
            );

            EstimationCrudService.updateEstimation = jest.fn().mockRejectedValue(new Error("Welllllll ... no!"));

            try {
                await EstimationFixService.fixEstimationForIssue(estimationToFix.issueKey);
                fail("it's execution was not expected to be be successful at all");
            } catch (e) {
                expect(e).toStrictEqual(new Error("Error while updating the estimation to fix"));
            }
        });

    });
});
