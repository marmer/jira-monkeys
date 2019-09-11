import IssueSiteInfos from "./IssueSiteInfos";

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

export default class EstimationCrudService {
    public static getEstimationsForIssueKey(issueKey: string): Promise<Estimation> {
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

    public static updateEstimation(estimation: Estimation): Promise<Response> {
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
        ).then(response => {
            if (response.status !== 204) {
                throw new Error("Unexpected request status: " + response.status);
            }
            return response;
        });
    }
}
