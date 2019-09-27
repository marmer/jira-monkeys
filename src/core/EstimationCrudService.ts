import IssueSiteInfos from "./IssueSiteInfos";

export interface Estimation {
    issueKey: string;
    issueSummary: string;
    originalEstimate?: string;
    originalEstimateInMinutes?: number;
    timeSpent?: string;
    remainingEstimateInMinutes?: number;
    remainingEstimate?: string;
    timeSpentMinutes?: number;
}

interface EstimationResponse {
    fields: {
        summary: string
        timetracking: {
            originalEstimate: string,
            remainingEstimate: string,
            timeSpent: string,
            originalEstimateSeconds: number,
            remainingEstimateSeconds: number,
            timeSpentSeconds: number,
        },
    };
}
export default class EstimationCrudService {
    public static async getEstimationsForIssueKey(issueKey: string): Promise<Estimation> {
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
                const timetracking = estimationResponse.fields.timetracking;
                const {originalEstimateSeconds, originalEstimate, remainingEstimate, remainingEstimateSeconds, timeSpent, timeSpentSeconds} = timetracking ? timetracking : ({} as any);
                return {
                    issueKey,
                    issueSummary: estimationResponse.fields.summary,
                    originalEstimate,
                    originalEstimateInMinutes: originalEstimateSeconds ? Math.floor(originalEstimateSeconds / 60) : originalEstimateSeconds,
                    remainingEstimate,
                    remainingEstimateInMinutes: remainingEstimateSeconds ? Math.floor(remainingEstimateSeconds / 60) : remainingEstimateSeconds,
                    timeSpentMinutes: timeSpentSeconds ? Math.floor(timeSpentSeconds / 60) : timeSpentSeconds,
                    timeSpent,
                } as Estimation;
            });
    }

    public static async updateEstimation(estimation: Estimation): Promise<void> {
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
        });
    }
}
