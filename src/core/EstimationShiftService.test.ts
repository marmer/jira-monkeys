import fetchMock from "fetch-mock";
import EstimationCrudService, {Estimation} from "./EstimationCrudService";
import EstimationShiftService from "./EstimationShiftService";

describe("EstimationShiftService", () => {
    const underTest = EstimationShiftService;

    beforeEach(() => {
        fetchMock.restore();
    });

    describe("shiftEstimation", () => {
        const someEstimation: Estimation = {
            remainingEstimate: "1h",
            originalEstimate: "1d",
            issueKey: "someIssue-1337",
            remainingEstimateInMinutes: 24,
            originalEstimateInMinutes: 42,
            issueSummary: "what a nice issue",
        };
        it("should be possible to shift estimation time from one issue to another if there is enough budget on the source issue", () => {
            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                (ik) => {
                    expect(ik).toMatch(/((sourceIssue-1234)|(targetIssue-42))/);
                    return Promise.resolve({
                        ...someEstimation,
                        issueKey: ik,
                        originalEstimateInMinutes: 60,
                        remainingEstimateInMinutes: 30,
                        originalEstimate: "1h",
                        remainingEstimate: "30m",
                    } as Estimation);
                });

            const estimationUpdateMock = jest.fn()
                .mockReturnValue(Promise.resolve());
            EstimationCrudService.updateEstimation = estimationUpdateMock;

            return underTest.shiftEstimation({
                timeToShiftAsJiraString: "15m",
                targetIssueKey: "targetIssue-42",
                sourceIssueKey: "sourceIssue-1234",
            }).then(
                () => {
                    expect(estimationUpdateMock.mock.calls[0][0]).toStrictEqual({
                        ...someEstimation,
                        issueKey: "targetIssue-42",
                        originalEstimateInMinutes: 75,
                        remainingEstimateInMinutes: 45,
                        originalEstimate: "1h 15m",
                        remainingEstimate: "45m",
                    });
                    expect(estimationUpdateMock.mock.calls[1][0]).toStrictEqual({
                        ...someEstimation,
                        issueKey: "sourceIssue-1234",
                        originalEstimateInMinutes: 45,
                        remainingEstimateInMinutes: 15,
                        originalEstimate: "45m",
                        remainingEstimate: "15m",
                    });
                },
            );
        });

        it("should it should return the shift results if the shift update was successful", () => {
            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                (ik) => {
                    expect(ik).toMatch(/((sourceIssue-1234)|(targetIssue-42))/);
                    return Promise.resolve({
                        ...someEstimation,
                        issueKey: ik,
                        originalEstimateInMinutes: 60,
                        remainingEstimateInMinutes: 30,
                        originalEstimate: "1h",
                        remainingEstimate: "30m",
                    } as Estimation);
                });

            EstimationCrudService.updateEstimation = jest.fn()
                .mockReturnValue(Promise.resolve());

            return underTest.shiftEstimation({
                timeToShiftAsJiraString: "15m",
                targetIssueKey: "targetIssue-42",
                sourceIssueKey: "sourceIssue-1234",
            }).then(result => {
                expect(result).toStrictEqual({
                    sourceEstimation: {
                        ...someEstimation,
                        issueKey: "sourceIssue-1234",
                        originalEstimateInMinutes: 45,
                        remainingEstimateInMinutes: 15,
                        originalEstimate: "45m",
                        remainingEstimate: "15m",
                    },
                    targetEstimation: {
                        ...someEstimation,
                        issueKey: "targetIssue-42",
                        originalEstimateInMinutes: 75,
                        remainingEstimateInMinutes: 45,
                        originalEstimate: "1h 15m",
                        remainingEstimate: "45m",
                    },
                });
            });
        });

        it("should set remaining estimations at the source to 0 if shifting is possible but the shift value is bigger than remaining", () => {
            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                (ik) => {
                    expect(ik).toMatch(/((sourceIssue-1234)|(targetIssue-42))/);
                    return Promise.resolve({
                        ...someEstimation,
                        issueKey: ik,
                        originalEstimateInMinutes: 60,
                        remainingEstimateInMinutes: 30,
                        originalEstimate: "1h",
                        remainingEstimate: "30m",
                    } as Estimation);
                });

            EstimationCrudService.updateEstimation = jest.fn()
                .mockReturnValue(Promise.resolve());

            return underTest.shiftEstimation({
                timeToShiftAsJiraString: "45m",
                targetIssueKey: "targetIssue-42",
                sourceIssueKey: "sourceIssue-1234",
            }).then(result => {
                expect(result).toStrictEqual({
                    sourceEstimation: {
                        ...someEstimation,
                        issueKey: "sourceIssue-1234",
                        originalEstimateInMinutes: 15,
                        remainingEstimateInMinutes: 0,
                        originalEstimate: "15m",
                        remainingEstimate: "0m",
                    },
                    targetEstimation: {
                        ...someEstimation,
                        issueKey: "targetIssue-42",
                        originalEstimateInMinutes: 105,
                        remainingEstimateInMinutes: 75,
                        originalEstimate: "1h 45m",
                        remainingEstimate: "1h 15m",
                    },
                });
            });
        });
        it("should raise an error without updating anything when not enough estimation time is left on the source issue", () => {
            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                (ik) => {
                    expect(ik).toMatch(/((sourceIssue-1234)|(targetIssue-42))/);
                    return Promise.resolve(ik === "sourceIssue-1234" ?
                        {
                            ...someEstimation,
                            issueKey: ik,
                            originalEstimateInMinutes: 15,
                            originalEstimate: "15m",
                        } as Estimation :
                        {
                            ...someEstimation,
                            issueKey: ik,
                        } as Estimation);
                });

            const updateEstimationMock = jest.fn()
                .mockReturnValue(Promise.resolve());
            EstimationCrudService.updateEstimation = updateEstimationMock;

            return underTest.shiftEstimation({
                timeToShiftAsJiraString: "30m",
                targetIssueKey: "targetIssue-42",
                sourceIssueKey: "sourceIssue-1234",
            }).catch(reason => {
                expect(reason).toStrictEqual(new Error("It is not possible to shift more estimation time than exists on sourceIssue-1234"));
                expect(updateEstimationMock.mock.calls).toHaveLength(0);

            });
        });
        it("should raise an error without updating anything when not enough estimation time is left on the source issue", () => {
            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                (ik) => {
                    expect(ik).toMatch(/((sourceIssue-1234)|(targetIssue-42))/);
                    return Promise.resolve(ik === "sourceIssue-1234" ?
                        {
                            issueKey: ik,
                            issueSummary: "what a nice issue",
                        } as Estimation :
                        {
                            ...someEstimation,
                            issueKey: ik,
                        } as Estimation);
                });

            const updateEstimationMock = jest.fn()
                .mockReturnValue(Promise.resolve());
            EstimationCrudService.updateEstimation = updateEstimationMock;

            return underTest.shiftEstimation({
                timeToShiftAsJiraString: "30m",
                targetIssueKey: "targetIssue-42",
                sourceIssueKey: "sourceIssue-1234",
            }).catch(reason => {
                expect(reason).toStrictEqual(new Error("It is not possible to shift more estimation time than exists on sourceIssue-1234"));
                expect(updateEstimationMock.mock.calls).toHaveLength(0);

            });
        });

        it("should simply return the issues if they are equal even in different cases", () => {
            EstimationCrudService.getEstimationsForIssueKey = (ik) => {
                expect(ik).toMatch(/ISSUE-123/i);
                return Promise.resolve(someEstimation);
            };

            return underTest.shiftEstimation({
                timeToShiftAsJiraString: "5d",
                targetIssueKey: "IssUe-123",
                sourceIssueKey: "iSSuE-123",
            }).then(result => {
                expect(result.sourceEstimation).toStrictEqual(someEstimation);
                expect(result.targetEstimation).toStrictEqual(someEstimation);
            });
        });

        it("should be to shift time to an issue without any budget", () => {
            EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation(
                (ik) => {
                    expect(ik).toMatch(/((sourceIssue-1234)|(targetIssue-42))/);
                    return Promise.resolve(ik === "sourceIssue-1234" ?
                        {
                            ...someEstimation,
                            issueKey: ik,
                            originalEstimateInMinutes: 60,
                            remainingEstimateInMinutes: 30,
                            originalEstimate: "1h",
                            remainingEstimate: "30m",
                        } as Estimation :
                        {
                            issueKey: ik,
                            issueSummary: "what a nice issue",
                        } as Estimation);
                });

            const estimationUpdateMock = jest.fn()
                .mockReturnValue(Promise.resolve());
            EstimationCrudService.updateEstimation = estimationUpdateMock;

            return underTest.shiftEstimation({
                timeToShiftAsJiraString: "15m",
                targetIssueKey: "targetIssue-42",
                sourceIssueKey: "sourceIssue-1234",
            }).then(
                () => {
                    expect(estimationUpdateMock.mock.calls[0][0]).toStrictEqual({
                        ...someEstimation,
                        issueKey: "targetIssue-42",
                        originalEstimateInMinutes: 15,
                        remainingEstimateInMinutes: 15,
                        originalEstimate: "15m",
                        remainingEstimate: "15m",
                    });
                    expect(estimationUpdateMock.mock.calls[1][0]).toStrictEqual({
                        ...someEstimation,
                        issueKey: "sourceIssue-1234",
                        originalEstimateInMinutes: 45,
                        remainingEstimateInMinutes: 15,
                        originalEstimate: "45m",
                        remainingEstimate: "15m",
                    });
                },
            );
        });
    });
    // TODO: marmer 11.09.2019 target shifting fails
    // TODO: marmer 11.09.2019 source shifting fails
});
