import * as reactTest from "@testing-library/react";
import React from "react";
import EstimationCrudService, {Estimation} from "../core/EstimationCrudService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import EstimationShiftView from "./EstimationShiftView";

describe("EstimationShiftView", () => {
    const baseEstimation: Estimation = {
        issueKey: "BASE-0815",
        issueSummary: "base estimation issue",
        originalEstimate: "1d",
        originalEstimateInMinutes: 480,
        remainingEstimate: "4h",
        remainingEstimateInMinutes: 240,
    };

    it("should render with estimation information for the current issue", async () => {
        const currentIssueKey = "currentIssue-123";

        IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentIssueKey);

        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === currentIssueKey) {
                return Promise.resolve({
                    ...baseEstimation,
                    issueKey: paramIssueKey,
                    issueSummary: "sourceSummary",
                });
            }
            fail("unexpected issuekeyrequest: " + paramIssueKey);
            return Promise.reject("unexpected issuekeyrequest: " + paramIssueKey);
        });

        const estimationShiftView = reactTest.render(<EstimationShiftView/>);

        const sourceIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle("currentIssue-123: sourceSummary"));
        console.log(reactTest.prettyDOM(estimationShiftView.container));

        const sourceIssueField = reactTest.getByLabelText(sourceIssueView, "Issue");
        expect(sourceIssueField).toHaveValue(currentIssueKey);
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

    it.skip("should do all the todos of this body ;)", () => {
        // TODO: marmer 12.09.2019 loading of this
        // TODO: marmer 12.09.2019 loading of others
        // TODO: marmer 12.09.2019 handling of error when loading this
        // TODO: marmer 12.09.2019 validation
        // TODO: marmer 12.09.2019 sending
        // TODO: marmer 12.09.2019 errorhandling when sending
        // TODO: marmer 12.09.2019 local storage
    });
});
