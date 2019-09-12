import * as reactTest from "@testing-library/react";
import React from "react";
import EstimationCrudService, {Estimation} from "../core/EstimationCrudService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import EstimationShiftView from "./EstimationShiftView";

describe("EstimationShiftView", () => {

    it("should render with estimation information for the current issue", () => {
        const currentIssueKey123 = "currentIssue-123";

        IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentIssueKey123);
        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === "getCurrentIssueKey") {
                return Promise.resolve({
// TODO: marmer 12.09.2019 go on here ... first create this Estimation ;)
                    issueKey: paramIssueKey,
                } as Estimation);
            }
            fail("unexpected issuekeyrequest: " + paramIssueKey);
            return Promise.reject("unexpected issuekeyrequest: " + paramIssueKey);
        });
        const estimationShiftView = reactTest.render(<EstimationShiftView/>);

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
