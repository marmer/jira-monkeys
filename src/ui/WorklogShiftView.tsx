import moment = require("moment");
import React, {Component, ReactNode} from "react";
import EstimationCrudService, {Estimation} from "../core/EstimationCrudService";
import JiraTimeService from "../core/JiraTimeService";
import WindowService from "../core/WindowService";
import WorklogService, {Worklog} from "../core/WorklogService";
import WorklogShiftService from "../core/WorklogShiftService";
import ModalView from "./ModalView";
import "./WorklogShiftView.css";

interface WorklogShiftViewState {
    worklogs?: Worklog[] | null;
    loadingError?: Error | null;
    targetIssueKey: string;
    timesToShift: {
        [worklogId: string]: string;
    };
    shiftError?: Error;
    estimation?: Estimation | null;
}

export default class WorklogShiftView extends Component<{}, WorklogShiftViewState> {

    private timer: any;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            targetIssueKey: "",
            timesToShift: {},
        };
    }

    public setState<K extends keyof WorklogShiftViewState>(state: ((prevState: Readonly<WorklogShiftViewState>, props: Readonly<{}>) => (Pick<WorklogShiftViewState, K> | WorklogShiftViewState | null)) | Pick<WorklogShiftViewState, K> | WorklogShiftViewState | null, callback?: () => void): void {
        super.setState(state, () => {
            sessionStorage.setItem(WorklogShiftView.name + "targetIssueKey", this.state.targetIssueKey);
        });
    }

    public componentDidMount(): void {
        const targetIssueKey = sessionStorage.getItem(WorklogShiftView.name + "targetIssueKey");

        this.setState({
            worklogs: null,
            loadingError: null,
            timesToShift: {},
            targetIssueKey: targetIssueKey ? targetIssueKey : "",
        });
        WorklogService.getWorklogsForCurrentIssueAndUser()
            .then(worklogs => {
                const timesToShift = worklogs.length === 0 ?
                    {} :
                    worklogs.map(w => ({
                        [w.id]: JiraTimeService.minutesToJiraFormat(w.timeSpentInMinutes),
                    })).reduce((previousValue, currentValue) => {
                        return {...previousValue, ...currentValue};
                    });

                return this.setState({
                    worklogs,
                    timesToShift,
                });
            })
            .catch(loadingError => this.setState({
                loadingError,
            }));
    }

    public render(): React.ReactElement {
        return <>
            {this.state.shiftError &&
            <ModalView onClose={() => WindowService.reloadPage()}>
                An unexpected error has occured while shifting the worklog. Please check the worklogs of this issue and
                the target issue. The Site is getting reloaded when you close this message.
                Error: {this.state.shiftError.message}
            </ModalView>}

            {this.state.loadingError &&
            <p>Error while loading worklogs for issue: {this.state.loadingError.message}</p>}

            {!this.state.loadingError && !this.state.worklogs &&
            <p>Loading...</p>}

            {this.state.worklogs && this.state.worklogs.length === 0 &&
            <p>No work logged here for you yet</p>}

            {this.state.worklogs && this.state.worklogs.length > 0 &&
            <div className="monkeyFlexContainer">
                <table className="monkeyTable">
                    <thead>
                    <tr>
                        <th align="center">Start</th>
                        <th align="center">Comment</th>
                        <th align="center">Time Spent</th>
                        <th align="center">Shift/Split time</th>
                        {/*<th align="center">Clone to Start (Work in Progress)</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.worklogs.map(wl => this.toRow(wl))
                    }
                    </tbody>
                </table>
                <div>
                    <label className="worklogShiftTarget">
                        Target Issue
                        <input placeholder="ISSUE-1234" title="Target Issue" value={this.state.targetIssueKey}
                               onChange={e => this.setState({targetIssueKey: e.target.value})}/>
                    </label>
                    <p>
                        {this.state.estimation && this.state.estimation.issueSummary}
                        {this.state.targetIssueKey && !this.state.estimation &&
                        <span data-testid="targetLoadErrorMarker"/>}
                    </p>
                </div>
            </div>}
        </>;
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<WorklogShiftViewState>, snapshot?: any): void {
        if (prevState.targetIssueKey !== this.state.targetIssueKey) {
            clearTimeout(this.timer);
            this.setState({estimation: null});

            EstimationCrudService.getEstimationsForIssueKey(this.state.targetIssueKey)
                .then(estimation => this.setState({
                    estimation
                }))
                .catch(() => {
                    //do nothing
                });
        }
    }

    private updateTimeToShift(newValue: string, worklog: Worklog) {
        this.setState({
            timesToShift: {...this.state.timesToShift, [worklog.id]: newValue},
        });
    }

    private toRow(worklog: Worklog): ReactNode {
        return <tr key={worklog.id}>
            <td align="center">
                <p>{moment(worklog.started).format("YYYY-MM-DD HH:mm:ss")}</p></td>
            <td align="center">
                <p>{worklog.comment}</p></td>
            <td align="center">
                <p>{JiraTimeService.minutesToJiraFormat(worklog.timeSpentInMinutes)}</p>
            </td>
            <td align="center">
                <input type="text" placeholder="5h 9m"
                       value={this.state.timesToShift[worklog.id]}
                       data-testid={"ShiftInput" + worklog.id}
                       onChange={e => this.updateTimeToShift(e.target.value, worklog)}/>
                <button data-testid={"ShiftButton" + worklog.id} title="move"
                        onClick={() => this.shiftTimeFor(worklog)}
                        disabled={!this.isShiftAllowedForWorklog(worklog)}>{">"}</button>
            </td>
            {/*<td align="center">*/}
            {/*    <input type="text" placeholder="2002-10-01 10:01:11"*/}
            {/*           value={moment(worklog.started).format("YYYY-MM-DD HH:mm:ss")}/>*/}
            {/*    <button data-testid={"CloneButton" + worklog.id} title="clone"*/}
            {/*            disabled={!this.isShiftAllowedForWorklog(worklog)}>{"+"}</button>*/}
            {/*</td>*/}
        </tr>;
    }

    private isShiftAllowedForWorklog(worklog: Worklog) {
        return this.isJiraStringIsSet() && JiraTimeService.isValidJiraFormat(this.state.timesToShift[worklog.id]);
    }

    private isJiraStringIsSet() {
        return this.state.targetIssueKey.trim() !== "";
    }

    private shiftTimeFor(worklog: Worklog) {
        WorklogShiftService.shiftWorklog(worklog, this.state.timesToShift[worklog.id], this.state.targetIssueKey)
            .then(() => {
                return WindowService.reloadPage();
            })
            .catch(shiftError => this.setState({shiftError}));
    }
}
