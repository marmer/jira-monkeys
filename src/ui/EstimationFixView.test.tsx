import * as reactTest from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import EstimationFixService from "../core/EstimationFixService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import WindowService from "../core/WindowService";
import EstimationFixView from "./EstimationFixView";

describe("EstimationFixView", () => {
    it("should fixing the estimation should reload the page", async () => {
        const currentIssueKey = "CURRENT-1234";

        IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentIssueKey);
        EstimationFixService.fixEstimationForIssue = jest.fn().mockImplementation(issueKey => {
            if (issueKey === currentIssueKey) {
                return Promise.resolve();
            }
            fail("unexpected issue key request: " + issueKey);
            return Promise.reject("Should not be reachable ");
        });

        WindowService.reloadPage = jest.fn();

        const estimationFixView = reactTest.render(<EstimationFixView/>);

        userEvent.click(estimationFixView.getByText("Fix estimation"));

        reactTest.wait(() => expect(WindowService.reloadPage).toBeCalled());
        expect(WindowService.reloadPage).toBeCalled();
    });
    // TODO: marmer 26.09.2019 handle error when estimation fix does not work
});
