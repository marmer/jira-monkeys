import * as reactTest from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, {FunctionComponent} from "react";
import EstimationFixService from "../core/EstimationFixService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import WindowService from "../core/WindowService";
import EstimationFixView from "./EstimationFixView";

jest.mock("./ModalView", () => ((({children, onClose}) =>
    <>
        <div data-testid="errorViewMock">
            {children}
        </div>
        <button data-testid="errorViewCloseButton" onClick={onClose}>X</button>
    </>) as FunctionComponent<{ onClose: () => void }>));

describe("EstimationFixView", () => {
    it("should fixing the estimation should reload the page", async () => {
        const currentIssueKey = "CURRENT-1234";

        IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentIssueKey);
        EstimationFixService.fixEstimationForIssue = jest.fn().mockImplementation(issueKey => {
            if (issueKey !== currentIssueKey) {
                fail("unexpected issue key request: " + issueKey);
            }
            return Promise.resolve();
        });

        WindowService.reloadPage = jest.fn();

        const estimationFixView = reactTest.render(<EstimationFixView/>);

        userEvent.click(estimationFixView.getByText("Fix estimation"));

        await reactTest.wait(() => expect(WindowService.reloadPage).toBeCalled());
        expect(WindowService.reloadPage).toBeCalled();
    });

    it("should show an error message without reloading", async () => {
        const currentIssueKey = "CURRENT-1234";

        IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentIssueKey);
        EstimationFixService.fixEstimationForIssue = jest.fn().mockImplementation(issueKey => {
            if (issueKey !== currentIssueKey) {
                fail("unexpected issue key request: " + issueKey);
            }
            return Promise.reject(new Error("something bad happend"));
        });

        WindowService.reloadPage = jest.fn();

        const estimationFixView = reactTest.render(<EstimationFixView/>);

        userEvent.click(estimationFixView.getByText("Fix estimation"));

        const errorView = await reactTest.waitForElement(() => estimationFixView.getByTestId("errorViewMock"));
        await reactTest.wait(() => expect(WindowService.reloadPage).not.toBeCalled());
        expect(errorView).toHaveTextContent("An unexpected error occurred while fixing the estimations. The page is getting reloaded on closing this message. Check the estimation afterwards");
        userEvent.click(estimationFixView.getByTestId("errorViewCloseButton"));

        await reactTest.wait(() => expect(WindowService.reloadPage).toBeCalled());
    });
});
