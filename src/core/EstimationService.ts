import IssueSiteInfos from "./IssueSiteInfos";
import JiraTimeService from "./JiraTimeService";

export interface Estimation {
    issueKey: string;
    issueSummary: string;
    originalEstimate: string;
    originalEstimateInMinutes: number;
    remainingEstimate: string;
    remainingEstimateInMinutes: number;
}

interface EstimationResponse {
    fields: {
        summary: string
        timetracking: {
            originalEstimate: string,
            remainingEstimate: string
            originalEstimateSeconds: number,
            remainingEstimateSeconds: number,
        },
    };
}

interface EstimationRequest {
    fields: {
        timetracking: {
            originalEstimate: string,
            remainingEstimate: string,
        },
    };
}

export default class EstimationService {
    public static getEstimationsForIssue(issueKey: string): Promise<Estimation> {
        const requestUrl = IssueSiteInfos.getIssueUrlForIssueKey(issueKey);
        return fetch(requestUrl, {method: "GET"})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Unexpected request status: " + response.status);
                }
                return response.json();
            })
            .then((response) => response as EstimationResponse)
            .then((estimationResponse) => {
                const {originalEstimateSeconds, originalEstimate, remainingEstimate, remainingEstimateSeconds} = estimationResponse.fields.timetracking;
                return {
                    issueKey,
                    issueSummary: estimationResponse.fields.summary,
                    originalEstimate,
                    originalEstimateInMinutes: Math.floor(originalEstimateSeconds / 60),
                    remainingEstimate,
                    remainingEstimateInMinutes: Math.floor(remainingEstimateSeconds / 60),
                } as Estimation;
            });
    }

    public static shiftEstimation(param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }): Promise<ShiftSummary> {
        if (param.targetIssueKey.toLocaleLowerCase() === param.sourceIssueKey.toLocaleLowerCase()) {
            return Promise.reject("Source and target issue must be different for estimation shiftings");
        }

        return this.loadSourceAndDestinationEsShiftSummaryFor(param)
            .then((currentStates) => this.calculateEstimationsAfterShift(currentStates, param.timeToShiftAsJiraString))
            .then(this.updateEstimations);
    }

    private static loadSourceAndDestinationEsShiftSummaryFor(param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }): Promise<ShiftSummary> {
        return this.getEstimationsForIssue(param.sourceIssueKey)
            .then((sourceEstimation) =>
                this.getEstimationsForIssue(param.targetIssueKey)
                    .then((targetEstimation) => ({
                        sourceEstimation,
                        targetEstimation,
                    } as ShiftSummary))
                    .then(summary => {
                        summary.sourceEstimation = {
                            ...summary.sourceEstimation,
                            originalEstimate: JiraTimeService.minutesToJiraFormat(!summary.sourceEstimation.originalEstimateInMinutes ? 0 : summary.sourceEstimation.originalEstimateInMinutes),
                            originalEstimateInMinutes: !summary.sourceEstimation.originalEstimateInMinutes ? 0 : summary.sourceEstimation.originalEstimateInMinutes,
                            remainingEstimate: JiraTimeService.minutesToJiraFormat(!summary.sourceEstimation.remainingEstimateInMinutes ? 0 : summary.sourceEstimation.remainingEstimateInMinutes),
                            remainingEstimateInMinutes: !summary.sourceEstimation.remainingEstimateInMinutes ? 0 : summary.sourceEstimation.remainingEstimateInMinutes,
                        };
                        summary.targetEstimation = {
                            ...summary.targetEstimation,
                            originalEstimate: JiraTimeService.minutesToJiraFormat(!summary.targetEstimation.originalEstimateInMinutes ? 0 : summary.targetEstimation.originalEstimateInMinutes),
                            originalEstimateInMinutes: !summary.targetEstimation.originalEstimateInMinutes ? 0 : summary.targetEstimation.originalEstimateInMinutes,
                            remainingEstimate: JiraTimeService.minutesToJiraFormat(!summary.targetEstimation.remainingEstimateInMinutes ? 0 : summary.targetEstimation.remainingEstimateInMinutes),
                            remainingEstimateInMinutes: !summary.targetEstimation.remainingEstimateInMinutes ? 0 : summary.targetEstimation.remainingEstimateInMinutes,
                        };
                        return summary;
                    }));
    }

    private static calculateEstimationsAfterShift(currentStates: ShiftSummary, timeToShiftAsJiraString: string): ShiftSummary {
        const sourceOriginalEstimateInMinutes: number = currentStates.sourceEstimation.originalEstimateInMinutes - JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);
        if (sourceOriginalEstimateInMinutes < 0) {
            throw new Error("It is not possible to shift more estimation time than exists on " + currentStates.sourceEstimation.issueKey);
        }

        const sourceRemainingEstimateInMinutes: number = currentStates.sourceEstimation.remainingEstimateInMinutes - JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);

        const targetOriginalEstimateInMinutes: number = currentStates.targetEstimation.originalEstimateInMinutes + JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);
        const targetRemainingEstimateInMinutes: number = currentStates.targetEstimation.remainingEstimateInMinutes + JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);

        return {
            sourceEstimation: {
                ...currentStates.sourceEstimation,
                originalEstimate: JiraTimeService.minutesToJiraFormat(sourceOriginalEstimateInMinutes),
                originalEstimateInMinutes: sourceOriginalEstimateInMinutes,
                remainingEstimate: JiraTimeService.minutesToJiraFormat(sourceRemainingEstimateInMinutes < 0 ? 0 : sourceRemainingEstimateInMinutes),
                remainingEstimateInMinutes: sourceRemainingEstimateInMinutes < 0 ? 0 : sourceRemainingEstimateInMinutes,
            },
            targetEstimation: {
                ...currentStates.targetEstimation,
                originalEstimate: JiraTimeService.minutesToJiraFormat(targetOriginalEstimateInMinutes),
                originalEstimateInMinutes: targetOriginalEstimateInMinutes,
                remainingEstimate: JiraTimeService.minutesToJiraFormat(targetRemainingEstimateInMinutes < 0 ? 0 : targetRemainingEstimateInMinutes),
                remainingEstimateInMinutes: targetRemainingEstimateInMinutes < 0 ? 0 : targetRemainingEstimateInMinutes,

            },
        };
    }

    private static fetchEstimationUpdate(estimation: Estimation): Promise<Response> {
        return fetch(IssueSiteInfos.getIssueUrlForIssueKey(estimation.issueKey),
            {
                body: JSON.stringify({
                    fields: {
                        timetracking: {
                            originalEstimate: estimation.originalEstimate,
                            remainingEstimate: estimation.remainingEstimate,
                        },
                    },
                }),
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json",
                },
                method: "PUT",
            },
        );
    }

    private static updateEstimations(updateStates: ShiftSummary): Promise<ShiftSummary> {
        return EstimationService.fetchEstimationUpdate(updateStates.targetEstimation)
            .then(targetResult => {
                if (targetResult.status !== 204) {
                    throw new Error("Error on updating destination ticket. Nothing was updated yet");
                }
                return EstimationService.fetchEstimationUpdate(updateStates.sourceEstimation)
                    .then((sourceResult) => {
                        if (sourceResult.status !== 204) {
                            throw new Error("Error on updating source ticket while target is allready updated. Please fix source estimation manually.");
                        }
                        return updateStates;
                    });
            });
    }
}

interface ShiftSummary {
    sourceEstimation: Estimation;
    targetEstimation: Estimation;
}
