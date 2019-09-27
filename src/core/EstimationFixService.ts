import EstimationCrudService from "./EstimationCrudService";
import JiraTimeService from "./JiraTimeService";

export default class EstimationFixService {
    public static async fixEstimationForIssue(issueKey: string): Promise<void> {
        const estimation = await EstimationCrudService.getEstimationsForIssueKey(issueKey);

        const {originalEstimateInMinutes, timeSpentMinutes} = estimation;

        let remainingEstimateInMinutes: number;
        if (originalEstimateInMinutes) {
            remainingEstimateInMinutes = originalEstimateInMinutes -
                (timeSpentMinutes ? timeSpentMinutes : 0);
        } else {
            remainingEstimateInMinutes = 0;
        }

        await EstimationCrudService.updateEstimation({
            ...estimation,
            remainingEstimateInMinutes,
            remainingEstimate: JiraTimeService.minutesToJiraFormat(remainingEstimateInMinutes),
        });
    }
}
