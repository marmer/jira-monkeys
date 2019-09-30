import EstimationCrudService, {Estimation} from "./EstimationCrudService";
import JiraTimeService from "./JiraTimeService";

export default class EstimationFixService {
    public static async fixEstimationForIssue(issueKey: string): Promise<void> {
        const estimation = await EstimationCrudService.getEstimationsForIssueKey(issueKey).catch(() => {
            throw new Error("Error while loading the estimation to fix");
        });

        const fixedRemainingEstimation = this.calculateRemainingEstimation(estimation);

        if (fixedRemainingEstimation === (estimation.remainingEstimateInMinutes ? estimation.remainingEstimateInMinutes : 0)) {
            return;
        }

        try {
            await EstimationCrudService.updateEstimation({
                ...estimation,
                remainingEstimateInMinutes: fixedRemainingEstimation,
                remainingEstimate: JiraTimeService.minutesToJiraFormat(fixedRemainingEstimation),
            });
        } catch (e) {
            throw new Error("Error while updating the estimation to fix");
        }
    }

    private static calculateRemainingEstimation(estimation: Estimation) {
        const {originalEstimateInMinutes, timeSpentMinutes} = estimation;

        if (!originalEstimateInMinutes) {
            return 0;
        }

        const remainingEstimateInMinutes: number = originalEstimateInMinutes - (timeSpentMinutes ? timeSpentMinutes : 0);
        return remainingEstimateInMinutes < 0 ? 0 : remainingEstimateInMinutes;
    }
}
