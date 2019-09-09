import JiraTimeService from "./JiraTimeService";

export interface Estimation {
    issueKey: string,
    issueSummary: string
    originalEstimate: string
    originalEstimateInMinutes: number
    remainingEstimate: string
    remainingEstimateInMinutes: number
}

interface EstimationResponse {
    fields: {
        summary: string
        timetracking: {
            originalEstimate: string,
            remainingEstimate: string
            originalEstimateSeconds: number,
            remainingEstimateSeconds: number
        }
    }
}

interface EstimationRequest {
    fields: {
        timetracking: {
            originalEstimate: string,
            remainingEstimate: string
        }
    }
}

export default class EstimationService {
    public static getEstimationsForIssue(issueKey: string): Promise<Estimation> {
        const worklogsUrl = window.location.origin + "/rest/api/2/issue/" + issueKey;

        return fetch(worklogsUrl, {"method": "GET"})
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Bad status")
                }
                return response.json()
            })
            .then(response => response as EstimationResponse)
            .then(estimationResponse => {
                const {originalEstimateSeconds, originalEstimate, remainingEstimate, remainingEstimateSeconds} = estimationResponse.fields.timetracking;
                return {
                    issueKey,
                    originalEstimate,
                    originalEstimateInMinutes: Math.floor(originalEstimateSeconds / 60),
                    remainingEstimate,
                    remainingEstimateInMinutes: Math.floor(remainingEstimateSeconds / 60),
                    issueSummary: estimationResponse.fields.summary
                } as Estimation
            })
    }

    public static shiftEstimation(param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }): Promise<ShiftSummary> {
        // TODO: marmer 09.09.2019 implkement me
        //todo load source and target estimations once again


        // .then(statesToUpdate => {
        //     todo send and set new estimations
        // });

        return this.loadSourceAndDestinationEsShiftSummaryFor(param)
            .then(currentStates => this.calculateEstimatinosAfterShift(currentStates, param.timeToShiftAsJiraString))
            .then(this.updateEstimations);
    }

    private static loadSourceAndDestinationEsShiftSummaryFor(param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }): Promise<ShiftSummary> {
        return this.getEstimationsForIssue(param.sourceIssueKey)
            .then(sourceEstimation =>
                this.getEstimationsForIssue(param.targetIssueKey)
                    .then(targetEstimation => ({
                        sourceEstimation: sourceEstimation,
                        targetEstimation: targetEstimation
                    } as ShiftSummary)));
    }

    private static calculateEstimatinosAfterShift(currentStates: ShiftSummary, timeToShiftAsJiraString: string): ShiftSummary {
        // TODO: marmer 09.09.2019 Handle negative results!
        const sourceRemainingEstimateInMinutes: number = currentStates.sourceEstimation.remainingEstimateInMinutes - JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);
        const sourceOriginalEstimateInMinutes: number = currentStates.sourceEstimation.originalEstimateInMinutes - JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);
        const targetRemainingEstimateInMinutes: number = currentStates.targetEstimation.remainingEstimateInMinutes + JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);
        const targetOriginalEstimateInMinutes: number = currentStates.targetEstimation.originalEstimateInMinutes + JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);

        return {
            sourceEstimation: {
                ...currentStates.sourceEstimation,
                remainingEstimateInMinutes: sourceRemainingEstimateInMinutes,
                originalEstimateInMinutes: sourceOriginalEstimateInMinutes,
                remainingEstimate: JiraTimeService.minutesToJiraFormat(sourceRemainingEstimateInMinutes),
                originalEstimate: JiraTimeService.minutesToJiraFormat(sourceOriginalEstimateInMinutes),
            },
            targetEstimation: {
                ...currentStates.targetEstimation,
                remainingEstimateInMinutes: targetRemainingEstimateInMinutes,
                originalEstimateInMinutes: targetOriginalEstimateInMinutes,
                remainingEstimate: JiraTimeService.minutesToJiraFormat(targetRemainingEstimateInMinutes),
                originalEstimate: JiraTimeService.minutesToJiraFormat(targetOriginalEstimateInMinutes),

            }
        };
    }

    private static updateEstimations(updateStates: ShiftSummary): Promise<ShiftSummary> {
        return fetch(window.location.origin + "/rest/api/2/issue/" + updateStates.targetEstimation.issueKey,
            {
                "method": "PUT",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "body": JSON.stringify({
                    fields: {
                        timetracking: {
                            originalEstimate: updateStates.targetEstimation.originalEstimate,
                            remainingEstimate: updateStates.targetEstimation.remainingEstimate
                        }
                    }
                })
            }
        )
            .then(result => {
                if (result.status != 204) {
                    throw "Error on updating destination ticket. Nothing was updated yet"
                }
                return fetch(window.location.origin + "/rest/api/2/issue/" + updateStates.sourceEstimation.issueKey, {
                    "method": "PUT",
                    "headers": {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    "body": JSON.stringify({
                        fields: {
                            timetracking: {
                                originalEstimate: updateStates.sourceEstimation.originalEstimate,
                                remainingEstimate: updateStates.sourceEstimation.remainingEstimate
                            }
                        }
                    })
                })
                    .then(result => {
                        if (result.status != 204) {
                            throw "Error on updating source ticket while target is allready updated. Please fix source estimation manually."
                        }
                        return updateStates
                    })
            })
    }
}

interface ShiftSummary {
    sourceEstimation: Estimation
    targetEstimation: Estimation
}