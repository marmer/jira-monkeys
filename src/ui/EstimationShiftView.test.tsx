import * as reactTest from "@testing-library/react";
import React from "react";
import EstimationCrudService, {Estimation} from "../core/EstimationCrudService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import EstimationShiftView from "./EstimationShiftView";
import userEvent from "@testing-library/user-event";

describe("EstimationShiftView", () => {
    const baseEstimation: Estimation = {
        issueKey: "BASE-0815",
        issueSummary: "base estimation issue",
        originalEstimate: "1d",
        originalEstimateInMinutes: 480,
        remainingEstimate: "4h",
        remainingEstimateInMinutes: 240,
    };

    const currentEstimation = {
        ...baseEstimation,
        issueKey: "currentIssue-123",
        issueSummary: "currentSummary",
    };
    const targetEstimation = {
        ...baseEstimation,
        issueKey: "targetIssue-123",
        issueSummary: "targetSummary",
        remainingEstimate: "1w",
        originalEstimate: "2w",
    };

    it("should render with estimation information for the current issue", async () => {
        IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentEstimation.issueKey);

        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === currentEstimation.issueKey) {
                return Promise.resolve(currentEstimation);
            }
            fail("unexpected issuekeyrequest: " + paramIssueKey);
            return Promise.reject("unexpected issuekeyrequest: " + paramIssueKey);
        });

        const estimationShiftView = reactTest.render(<EstimationShiftView/>);

        const sourceIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle("currentIssue-123: currentSummary"));

        const sourceIssueField = reactTest.getByLabelText(sourceIssueView, "Issue");
        expect(sourceIssueField).toHaveValue(currentEstimation.issueKey);
        expect(sourceIssueField).toBeDisabled();
        expect(sourceIssueField).toHaveAttribute("type", "text");

        const sourceOriginalEstimateField = reactTest.getByLabelText(sourceIssueView, "Original Estimate");
        expect(sourceOriginalEstimateField).toHaveValue("1d");
        expect(sourceOriginalEstimateField).toBeDisabled();
        expect(sourceOriginalEstimateField).toHaveAttribute("type", "text");

        const sourceRemainingEstimateField = reactTest.getByLabelText(sourceIssueView, "Remaining Estimate");
        expect(sourceRemainingEstimateField).toHaveValue("4h");
        expect(sourceRemainingEstimateField).toBeDisabled();
        expect(sourceRemainingEstimateField).toHaveAttribute("type", "text");
    });

    it("should try to load the target issue delayed", async () => {
        IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentEstimation.issueKey);

        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === targetEstimation.issueKey) {
                return Promise.resolve(targetEstimation);
            }

            if (paramIssueKey === currentEstimation.issueKey) {
                return Promise.resolve(currentEstimation);
            }

            fail("No request expected for an issue with key: " + paramIssueKey);
            return Promise.reject("No request expected for an issue with key: " + paramIssueKey);
        });

        const estimationShiftView = reactTest.render(<EstimationShiftView/>);

        const estimationShiftInput = estimationShiftView.getByLabelText("Time to shift");
        expect(estimationShiftInput).toBeDisabled();

        const targetIssueKeyInput = estimationShiftView.getByLabelText("Issue key");
        await userEvent.type(targetIssueKeyInput, "unfinishedInput");
        expect(estimationShiftInput).toBeDisabled();
        await userEvent.type(targetIssueKeyInput, targetEstimation.issueKey);
        expect(estimationShiftInput).toBeDisabled();

        expect(estimationShiftView.queryByTitle(labelText => labelText.endsWith(targetEstimation.issueSummary))).toBeNull();
        const targetIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(labelText => labelText.endsWith(targetEstimation.issueKey + ": " + targetEstimation.issueSummary)));

        expect(estimationShiftInput).toBeEnabled();

        const sourceIssueField = reactTest.getByLabelText(targetIssueView, "Issue");
        expect(sourceIssueField).toHaveValue(targetEstimation.issueKey);
        expect(sourceIssueField).toBeDisabled();
        expect(sourceIssueField).toHaveAttribute("type", "text");

        const sourceOriginalEstimateField = reactTest.getByLabelText(targetIssueView, "Original Estimate");
        expect(sourceOriginalEstimateField).toHaveValue(targetEstimation.originalEstimate);
        expect(sourceOriginalEstimateField).toBeDisabled();
        expect(sourceOriginalEstimateField).toHaveAttribute("type", "text");

        const sourceRemainingEstimateField = reactTest.getByLabelText(targetIssueView, "Remaining Estimate");
        expect(sourceRemainingEstimateField).toHaveValue(targetEstimation.remainingEstimate);
        expect(sourceRemainingEstimateField).toBeDisabled();
        expect(sourceRemainingEstimateField).toHaveAttribute("type", "text");
    });

    it.skip("should do all the todos of this body ;)", () => {
        // TODO: marmer 12.09.2019 handling of error when loading THIS initially
        // TODO: marmer 12.09.2019 handling of error when loading THIS
        // TODO: marmer 12.09.2019 handling of error when loading target
        // TODO: marmer 12.09.2019 validation
        // TODO: marmer 12.09.2019 sending
        // TODO: marmer 12.09.2019 errorhandling when sending
        // TODO: marmer 12.09.2019 local storage
    });
});
