import EstimationCrudService from "./EstimationCrudService";
import JiraTimeService from "./JiraTimeService";

export default class EstimationFixService {
    public static async fixEstimationForIssue(issueKey: string): Promise<void> {
        const estimation = await EstimationCrudService.getEstimationsForIssueKey(issueKey);

        console.log(estimation);
        console.log(estimation.originalEstimateInMinutes);
        console.log(estimation.timeSpentMinutes);
        const remainingEstimateInMinutes = estimation.originalEstimateInMinutes! - estimation.timeSpentMinutes!;
        console.log(remainingEstimateInMinutes);

        await EstimationCrudService.updateEstimation({
            ...estimation,
            remainingEstimateInMinutes,
            remainingEstimate: JiraTimeService.minutesToJiraFormat(remainingEstimateInMinutes),
        });
    }
}
