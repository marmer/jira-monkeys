import EstimationCrudService, {Estimation} from "./EstimationCrudService";
import JiraTimeService from "./JiraTimeService";

export default class EstimationShiftService {
    public static shiftEstimation(param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }): Promise<ShiftSum> {
        if (param.targetIssueKey.toLocaleLowerCase() === param.sourceIssueKey.toLocaleLowerCase()) {
            return EstimationCrudService.getEstimationsForIssueKey(param.sourceIssueKey)
                .then(result =>
                    ({
                        targetEstimation: result,
                        sourceEstimation: result,
                    } as ShiftSum));
        }

        return this.loadSourceAndTargetEstimationShiftSummaryFor(param)
            .then((currentStates) => this.calculateEstimationsAfterShift(currentStates, param.timeToShiftAsJiraString))
            .then(this.updateEstimations);
    }

    private static toFixedShiftSum(summary: ShiftSum): ShiftSum {
        summary.sourceEstimation = {
            ...summary.sourceEstimation,
            originalEstimate: JiraTimeService.minutesToJiraFormat(!summary.sourceEstimation.originalEstimateInMinutes ? 0 : summary.sourceEstimation.originalEstimateInMinutes),
            originalEstimateInMinutes: !summary.sourceEstimation.originalEstimateInMinutes ? 0 : summary.sourceEstimation.originalEstimateInMinutes,
            remainingEstimate: JiraTimeService.minutesToJiraFormat(!summary.sourceEstimation.remainingEstimateInMinutes ? 0 : summary.sourceEstimation.remainingEstimateInMinutes),
            remainingEstimateInMinutes: !summary.sourceEstimation.remainingEstimateInMinutes ? 0 : summary.sourceEstimation.remainingEstimateInMinutes,
        };
        summary.targetEstimation = {
            ...summary.targetEstimation,
            originalEstimate: JiraTimeService.minutesToJiraFormat(!summary.targetEstimation.originalEstimateInMinutes ? 0 : summary.targetEstimation.originalEstimateInMinutes),
            originalEstimateInMinutes: !summary.targetEstimation.originalEstimateInMinutes ? 0 : summary.targetEstimation.originalEstimateInMinutes,
            remainingEstimate: JiraTimeService.minutesToJiraFormat(!summary.targetEstimation.remainingEstimateInMinutes ? 0 : summary.targetEstimation.remainingEstimateInMinutes),
            remainingEstimateInMinutes: !summary.targetEstimation.remainingEstimateInMinutes ? 0 : summary.targetEstimation.remainingEstimateInMinutes,
        };
        return summary;
    }

    private static loadSourceAndTargetEstimationShiftSummaryFor(param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }): Promise<ShiftSum> {
        return EstimationCrudService.getEstimationsForIssueKey(param.sourceIssueKey)
            .then((sourceEstimation) =>
                EstimationCrudService.getEstimationsForIssueKey(param.targetIssueKey)
                    .then((targetEstimation) => ({
                        sourceEstimation,
                        targetEstimation,
                    } as ShiftSum))
                    .then(EstimationShiftService.toFixedShiftSum));
    }

    private static calculateEstimationsAfterShift(currentStates: ShiftSum, timeToShiftAsJiraString: string): ShiftSum {
        const sourceOriginalEstimateInMinutes: number = currentStates.sourceEstimation.originalEstimateInMinutes - JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);
        if (sourceOriginalEstimateInMinutes < 0) {
            throw new Error("It is not possible to shift more estimation time than exists on " + currentStates.sourceEstimation.issueKey);
        }

        const sourceRemainingEstimateInMinutes: number = currentStates.sourceEstimation.remainingEstimateInMinutes - JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);

        const targetOriginalEstimateInMinutes: number = currentStates.targetEstimation.originalEstimateInMinutes + JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);
        const targetRemainingEstimateInMinutes: number = currentStates.targetEstimation.remainingEstimateInMinutes + JiraTimeService.jiraFormatToMinutes(timeToShiftAsJiraString);

        return {
            sourceEstimation: {
                ...currentStates.sourceEstimation,
                originalEstimate: JiraTimeService.minutesToJiraFormat(sourceOriginalEstimateInMinutes),
                originalEstimateInMinutes: sourceOriginalEstimateInMinutes,
                remainingEstimate: JiraTimeService.minutesToJiraFormat(sourceRemainingEstimateInMinutes < 0 ? 0 : sourceRemainingEstimateInMinutes),
                remainingEstimateInMinutes: sourceRemainingEstimateInMinutes < 0 ? 0 : sourceRemainingEstimateInMinutes,
            },
            targetEstimation: {
                ...currentStates.targetEstimation,
                originalEstimate: JiraTimeService.minutesToJiraFormat(targetOriginalEstimateInMinutes),
                originalEstimateInMinutes: targetOriginalEstimateInMinutes,
                remainingEstimate: JiraTimeService.minutesToJiraFormat(targetRemainingEstimateInMinutes < 0 ? 0 : targetRemainingEstimateInMinutes),
                remainingEstimateInMinutes: targetRemainingEstimateInMinutes < 0 ? 0 : targetRemainingEstimateInMinutes,

            },
        };
    }

    private static updateEstimations(updateStates: ShiftSum): Promise<ShiftSum> {
        return EstimationCrudService.updateEstimation(updateStates.targetEstimation)
            .then(
                () => EstimationCrudService.updateEstimation(updateStates.sourceEstimation)
                    .then(
                        () => updateStates,
                        () => {
                                throw new Error("Error on updating source issue while target is already updated. Please fix source estimation manually.");
                            }),
                () => {
                    throw new Error("Error on updating destination issue. Nothing was updated yet");
                },
            );
    }
}

interface ShiftSum {
    sourceEstimation: Estimation;
    targetEstimation: Estimation;
}
