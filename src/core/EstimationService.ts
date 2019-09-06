export interface Estimation {
    issueKey: string,
    originalEstimate: string
    originalEstimateInSeconds: number
    remainingEstimate: string
    remainingEstimateInSeconds: number
}

interface EstimationResponse {
    fields: {
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


                // TODO: marmer 06.09.2019 Work in Progress
                return {
                    issueKey,
                    originalEstimate,
                    originalEstimateInSeconds: originalEstimateSeconds,
                    remainingEstimate,
                    remainingEstimateInSeconds: remainingEstimateSeconds
                } as Estimation
            })
    }
}