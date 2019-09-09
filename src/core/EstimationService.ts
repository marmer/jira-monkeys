export interface Estimation {
    issueKey: string,
    issueSummary: string
    originalEstimate: string
    originalEstimateInSeconds: number
    remainingEstimate: string
    remainingEstimateInSeconds: number
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
                    originalEstimateInSeconds: originalEstimateSeconds,
                    remainingEstimate,
                    remainingEstimateInSeconds: remainingEstimateSeconds,
                    issueSummary: estimationResponse.fields.summary
                } as Estimation
            })
    }

    public static shiftEstimation(param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }): Promise<{ newSourceEstimation: Estimation, newDestinationEstimation: Estimation }> {
        // TODO: marmer 09.09.2019 implkement me
        //load source and target estimations
        //recalculate new estimations
        //set new estimations


        // const estimationRequest: EstimationRequest = {
        //     fields: {
        //         timetracking: {
        //             originalEstimate: "2d",
        //             remainingEstimate: "3h"
        //         }
        //     }
        // };
        // return fetch("***/rest/api/2/issue/***", {
        //     "method": "PUT",
        //     "headers": {
        //         "content-type": "application/json",
        //         "accept": "application/json"
        //     },
        //     "body": JSON.stringify(estimationRequest)
        // })

        return Promise.resolve()
            .then(value => {
                return {
                    newSourceEstimation: {
                        issueKey: "TODO",
                        issueSummary: "TODO",
                        originalEstimate: "TODO",
                        originalEstimateInSeconds: 42,
                        remainingEstimate: "TODO",
                        remainingEstimateInSeconds: 42,
                    },
                    newDestinationEstimation: {
                        issueKey: "TODO",
                        issueSummary: "TODO",
                        originalEstimate: "TODO",
                        originalEstimateInSeconds: 42,
                        remainingEstimate: "TODO",
                        remainingEstimateInSeconds: 42
                    }
                }
            });
    }
}