import * as reactTest from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, {FunctionComponent} from "react";
import EstimationCrudService, {Estimation} from "../core/EstimationCrudService";
import EstimationShiftService from "../core/EstimationShiftService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import JiraTimeService from "../core/JiraTimeService";
import EstimationShiftView from "./EstimationShiftView";

jest.mock("./ModalView", () => ((({children, onClose}) =>
    <>
        <div data-testid="errorViewMock">
            {children}
        </div>
        <button data-testid="errorViewCloseButton" onClick={onClose}>X</button>
    </>) as FunctionComponent<{ onClose: () => void }>));

describe("EstimationShiftView", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });
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
    IssueSiteInfos.getCurrentIssueKey = jest.fn().mockReturnValue(currentEstimation.issueKey);

    it("should render with estimation information for the current issue", async () => {

        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === currentEstimation.issueKey) {
                return Promise.resolve(currentEstimation);
            }
            fail("unexpected issuekeyrequest: " + paramIssueKey);
            return Promise.reject("unexpected issuekeyrequest: " + paramIssueKey);
        });

        const estimationShiftView = reactTest.render(<EstimationShiftView/>);

        const sourceIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(getEstimationViewTitleFor(currentEstimation)));

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
        const targetIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(labelText => labelText === getEstimationViewTitleFor(targetEstimation)));

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

    it("should not be possible to send an estimation with an invalid jira string", async () => {
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
        const issueKeyInput = estimationShiftView.getByLabelText("Issue key");
        userEvent.type(issueKeyInput, targetEstimation.issueKey);

        const timeToShiftInput = estimationShiftView.getByLabelText("Time to shift");
        await reactTest.wait(() => expect(timeToShiftInput).toBeEnabled());

        const invalidJiraTimeString = "24invalid";
        const validJiraTimeString = "42valid";
        JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(timeString => timeString === validJiraTimeString);

        userEvent.type(timeToShiftInput, invalidJiraTimeString);
        const sendButton = estimationShiftView.getByTitle("send");
        await reactTest.wait(() => expect(sendButton).toBeDisabled());

        userEvent.type(timeToShiftInput, validJiraTimeString);
        await reactTest.wait(() => expect(sendButton).toBeEnabled());
    });

    function getEstimationViewTitleFor(estimation: Estimation) {
        return estimation.issueKey + ": " + estimation.issueSummary;
    }

    it("should show the sending results after send", async () => {
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
        const issueKeyInput = estimationShiftView.getByLabelText("Issue key");
        userEvent.type(issueKeyInput, targetEstimation.issueKey);

        const timeToShiftInput = estimationShiftView.getByLabelText("Time to shift");
        await reactTest.wait(() => expect(timeToShiftInput).toBeEnabled());

        const jiraTimeString = "42m";
        JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(timeString => timeString === jiraTimeString);
        userEvent.type(timeToShiftInput, jiraTimeString);

        const sendButton = estimationShiftView.getByTitle("send");
        const fetchButton = estimationShiftView.getByTitle("fetch");
        await reactTest.wait(() => expect(sendButton).toBeEnabled());

        const updatedCurrentEstimation = {
            ...currentEstimation,
            originalEstimate: "newCurrentOriginalEstimate",
            remainingEstimate: "newCurrentRemainingEstimate",
        };
        const updatedTargetEstimation = {
            ...targetEstimation,
            originalEstimate: "newTargetOriginalEstimate",
            remainingEstimate: "newTargetRemainingEstimate",
        };

        EstimationShiftService.shiftEstimation = jest.fn().mockImplementation((param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }) => {
                expect(param.sourceIssueKey).toBe(currentEstimation.issueKey);
                expect(param.targetIssueKey).toBe(targetEstimation.issueKey);
                return Promise.resolve({
                        sourceEstimation: updatedCurrentEstimation,
                        targetEstimation: updatedTargetEstimation,
                    },
                );
            },
        );

        userEvent.click(sendButton);
        expect(sendButton).toBeDisabled();
        expect(fetchButton).toBeDisabled();
        const sourceIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(getEstimationViewTitleFor(currentEstimation)));

        const sourceOriginalEstimateField = reactTest.getByLabelText(sourceIssueView, "Original Estimate");
        await reactTest.wait(() => expect(sourceOriginalEstimateField).toHaveValue(updatedCurrentEstimation.originalEstimate));

        const sourceRemainingEstimateField = reactTest.getByLabelText(sourceIssueView, "Remaining Estimate");
        expect(sourceRemainingEstimateField).toHaveValue(updatedCurrentEstimation.remainingEstimate);

        const targetIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(getEstimationViewTitleFor(targetEstimation)));

        const targetOriginalEstimateField = reactTest.getByLabelText(targetIssueView, "Original Estimate");
        await reactTest.wait(() => expect(targetOriginalEstimateField).toHaveValue(updatedTargetEstimation.originalEstimate));

        const targetRemainingEstimateField = reactTest.getByLabelText(targetIssueView, "Remaining Estimate");
        expect(targetRemainingEstimateField).toHaveValue(updatedTargetEstimation.remainingEstimate);

        expect(sendButton).toBeEnabled();
        expect(fetchButton).toBeEnabled();
    });

    it("should show the fetching results after send", async () => {
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
        const issueKeyInput = estimationShiftView.getByLabelText("Issue key");
        userEvent.type(issueKeyInput, targetEstimation.issueKey);

        const timeToShiftInput = estimationShiftView.getByLabelText("Time to shift");
        await reactTest.wait(() => expect(timeToShiftInput).toBeEnabled());

        const jiraTimeString = "42m";
        JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(timeString => timeString === jiraTimeString);
        userEvent.type(timeToShiftInput, jiraTimeString);

        const sendButton = estimationShiftView.getByTitle("send");
        const fetchButton = estimationShiftView.getByTitle("fetch");
        await reactTest.wait(() => expect(fetchButton).toBeEnabled());

        const updatedCurrentEstimation = {
            ...currentEstimation,
            originalEstimate: "newCurrentOriginalEstimate",
            remainingEstimate: "newCurrentRemainingEstimate",
        };
        const updatedTargetEstimation = {
            ...targetEstimation,
            originalEstimate: "newTargetOriginalEstimate",
            remainingEstimate: "newTargetRemainingEstimate",
        };

        EstimationShiftService.shiftEstimation = jest.fn().mockImplementation((param: { targetIssueKey: string; timeToShiftAsJiraString: string; sourceIssueKey: string }) => {
                expect(param.sourceIssueKey).toBe(targetEstimation.issueKey);
                expect(param.targetIssueKey).toBe(currentEstimation.issueKey);
                return Promise.resolve({
                        sourceEstimation: updatedTargetEstimation,
                        targetEstimation: updatedCurrentEstimation,
                    },
                );
            },
        );

        userEvent.click(fetchButton);
        expect(sendButton).toBeDisabled();
        expect(fetchButton).toBeDisabled();
        const sourceIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(getEstimationViewTitleFor(currentEstimation)));

        const sourceOriginalEstimateField = reactTest.getByLabelText(sourceIssueView, "Original Estimate");
        await reactTest.wait(() => expect(sourceOriginalEstimateField).toHaveValue(updatedCurrentEstimation.originalEstimate));

        const sourceRemainingEstimateField = reactTest.getByLabelText(sourceIssueView, "Remaining Estimate");
        expect(sourceRemainingEstimateField).toHaveValue(updatedCurrentEstimation.remainingEstimate);

        const targetIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(getEstimationViewTitleFor(targetEstimation)));

        const targetOriginalEstimateField = reactTest.getByLabelText(targetIssueView, "Original Estimate");
        await reactTest.wait(() => expect(targetOriginalEstimateField).toHaveValue(updatedTargetEstimation.originalEstimate));

        const targetRemainingEstimateField = reactTest.getByLabelText(targetIssueView, "Remaining Estimate");
        expect(targetRemainingEstimateField).toHaveValue(updatedTargetEstimation.remainingEstimate);

        expect(sendButton).toBeEnabled();
        expect(fetchButton).toBeEnabled();
    });

    it("should show an empty source estimation when an error occurs while initially loading a source estimation", async () => {
        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === currentEstimation.issueKey) {
                return Promise.reject(new Error("something went wrong"));
            }
            fail("unexpected issuekeyrequest: " + paramIssueKey);
            return Promise.reject("unexpected issuekeyrequest: " + paramIssueKey);
        });

        const estimationShiftView = reactTest.render(<EstimationShiftView/>);

        const sourceIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(getEstimationTitleOnErrorFor(currentEstimation)));

        const sourceIssueField = reactTest.getByLabelText(sourceIssueView, "Issue");
        expect(sourceIssueField).toHaveValue(currentEstimation.issueKey);

        const sourceOriginalEstimateField = reactTest.getByLabelText(sourceIssueView, "Original Estimate");
        expect(sourceOriginalEstimateField).toHaveValue("Error");

        const sourceRemainingEstimateField = reactTest.getByLabelText(sourceIssueView, "Remaining Estimate");
        expect(sourceRemainingEstimateField).toHaveValue("Error");
    });

    it("should show an empty target estimation when an error occurs while the target estimation", async () => {
        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === currentEstimation.issueKey) {
                return Promise.resolve(currentEstimation);
            } else if (paramIssueKey === targetEstimation.issueKey) {
                return Promise.reject(new Error("something went wrong"));
            }
            fail("unexpected issuekeyrequest: " + paramIssueKey);
            return Promise.reject("unexpected issuekeyrequest: " + paramIssueKey);
        });

        const estimationShiftView = reactTest.render(<EstimationShiftView/>);

        userEvent.type(estimationShiftView.getByLabelText("Issue key"), targetEstimation.issueKey);

        const sourceIssueView = await reactTest.waitForElement(() => estimationShiftView.getByTitle(getEstimationTitleOnErrorFor(targetEstimation)));

        const sourceIssueField = reactTest.getByLabelText(sourceIssueView, "Issue");
        expect(sourceIssueField).toHaveValue(targetEstimation.issueKey);

        const sourceOriginalEstimateField = reactTest.getByLabelText(sourceIssueView, "Original Estimate");
        expect(sourceOriginalEstimateField).toHaveValue("Error");

        const sourceRemainingEstimateField = reactTest.getByLabelText(sourceIssueView, "Remaining Estimate");
        expect(sourceRemainingEstimateField).toHaveValue("Error");
    });

    function getEstimationTitleOnErrorFor(estimation: Estimation) {
        return estimation.issueKey + ": Error";
    }

    it("should show an appropriate error message when a sending an estimation is not successful", async () => {
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
        const issueKeyInput = estimationShiftView.getByLabelText("Issue key");
        userEvent.type(issueKeyInput, targetEstimation.issueKey);

        const timeToShiftInput = estimationShiftView.getByLabelText("Time to shift");
        await reactTest.wait(() => expect(timeToShiftInput).toBeEnabled());

        const jiraTimeString = "42m";
        JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(timeString => timeString === jiraTimeString);
        userEvent.type(timeToShiftInput, jiraTimeString);

        const sendButton = estimationShiftView.getByTitle("send");
        estimationShiftView.getByTitle("fetch");
        await reactTest.wait(() => expect(sendButton).toBeEnabled());

        EstimationShiftService.shiftEstimation = jest.fn().mockImplementation(() => {
            return Promise.reject(new Error("Too bad"));
        });

        userEvent.click(sendButton);

        // const errorView = await reactTest.waitForElement(() => estimationShiftView.getByTitle("errorView"));

        const errorView = await reactTest.waitForElement(
            () => estimationShiftView.getByTestId("errorViewMock"));

        reactTest.getByText(errorView, "Something went wrong while sending: Error: Too bad");

        userEvent.click(estimationShiftView.getByTestId("errorViewCloseButton"));

        reactTest.waitForElementToBeRemoved(() => errorView);
    });

    it("should show an appropriate error message when a fetching an estimation is not successful", async () => {
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
        const issueKeyInput = estimationShiftView.getByLabelText("Issue key");
        userEvent.type(issueKeyInput, targetEstimation.issueKey);

        const timeToShiftInput = estimationShiftView.getByLabelText("Time to shift");
        await reactTest.wait(() => expect(timeToShiftInput).toBeEnabled());

        const jiraTimeString = "42m";
        JiraTimeService.isValidJiraFormat = jest.fn().mockImplementation(timeString => timeString === jiraTimeString);
        userEvent.type(timeToShiftInput, jiraTimeString);

        const fetchButton = estimationShiftView.getByTitle("fetch");
        await reactTest.wait(() => expect(fetchButton).toBeEnabled());

        EstimationShiftService.shiftEstimation = jest.fn().mockImplementation(() => {
            return Promise.reject(new Error("Too bad"));
        });

        userEvent.click(fetchButton);

        const errorView = await reactTest.waitForElement(
            () => estimationShiftView.getByTestId("errorViewMock"));

        reactTest.getByText(errorView, "Something went wrong while fetching: Error: Too bad");

        userEvent.click(estimationShiftView.getByTestId("errorViewCloseButton"));

        reactTest.waitForElementToBeRemoved(() => errorView);
    });

    it("should do all the todos of this body ;)", () => {
        EstimationCrudService.getEstimationsForIssueKey = jest.fn().mockImplementation((paramIssueKey: string): Promise<Estimation> => {
            if (paramIssueKey === currentEstimation.issueKey) {
                return Promise.resolve(currentEstimation);
            }
            fail("unexpected issuekeyrequest: " + paramIssueKey);
            return Promise.reject("unexpected issuekeyrequest: " + paramIssueKey);
        });

        const estimationShiftView = reactTest.render(<EstimationShiftView/>);
        userEvent.type(estimationShiftView.getByLabelText("Issue key"), "someTargetKey-123");
        expect(estimationShiftView.getByLabelText("Issue key")).toHaveValue("someTargetKey-123");
        estimationShiftView.unmount();

        expect(reactTest.render(<EstimationShiftView/>).getByLabelText("Issue key")).toHaveValue("someTargetKey-123");
    });
});
