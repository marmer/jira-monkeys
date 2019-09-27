import EstimationCrudService from "./EstimationCrudService";
import JiraTimeService from "./JiraTimeService";

export default class EstimationFixService {
    public static async fixEstimationForIssue(issueKey: string): Promise<void> {
        const estimation = await EstimationCrudService.getEstimationsForIssueKey(issueKey).catch(() => {
            throw new Error("Error while loading the estimation to fix");
        });

        const {originalEstimateInMinutes, timeSpentMinutes} = estimation;

        let remainingEstimateInMinutes: number;
        if (originalEstimateInMinutes) {
            remainingEstimateInMinutes = originalEstimateInMinutes -
                (timeSpentMinutes ? timeSpentMinutes : 0);
            if (remainingEstimateInMinutes < 0) {
                remainingEstimateInMinutes = 0;
            }
        } else {
            remainingEstimateInMinutes = 0;
        }

        if (remainingEstimateInMinutes === (estimation.remainingEstimateInMinutes ? estimation.remainingEstimateInMinutes : 0)) {
            return;
        }

        try {
            await EstimationCrudService.updateEstimation({
                ...estimation,
                remainingEstimateInMinutes,
                remainingEstimate: JiraTimeService.minutesToJiraFormat(remainingEstimateInMinutes),
            });
        } catch (e) {
            throw new Error("Error while updating the estimation to fix");
        }
    }
}
