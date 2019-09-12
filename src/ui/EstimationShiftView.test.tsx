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
        const currentIssueKey123 = "currentIssue-123";

        IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentIssueKey123);

        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === currentIssueKey123) {
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

        const originalEstimateInput = reactTest.getByLabelText(sourceIssueView, content => content === "Original Estimate:");
        expect(originalEstimateInput).toHaveValue("1d");
        expect(originalEstimateInput).toBeDisabled();
        expect(originalEstimateInput).toHaveAttribute("type", "text");

        fail("go on here ;)")
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
