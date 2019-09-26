import EstimationCrudService from "./EstimationCrudService";
import JiraTimeService from "./JiraTimeService";

export default class EstimationFixService {
    public static async fixEstimationForIssue(issueKey: string): Promise<void> {
        const estimation = await EstimationCrudService.getEstimationsForIssueKey(issueKey);

        const remainingEstimateInMinutes = estimation.originalEstimateInMinutes! - estimation.timeSpentMinutes!;

        EstimationCrudService.updateEstimation({
            ...estimation,
            remainingEstimateInMinutes,
            remainingEstimate: JiraTimeService.minutesToJiraFormat(remainingEstimateInMinutes),
        });
    }
}
