import moment = require("moment");
import React, {Component, ReactNode} from "react";
import JiraTimeService from "../core/JiraTimeService";
import WindowService from "../core/WindowService";
import WorklogService, {Worklog} from "../core/WorklogService";
import WorklogShiftService from "../core/WorklogShiftService";
import ModalView from "./ModalView";

interface WorklogShiftViewState {
    worklogs?: Worklog[] | null;
    loadingError?: Error | null;
    targetIssueKey: string;
    timesToShift: {
        [worklogId: string]: string;
    };
    shiftError?: Error;
}

export default class WorklogShiftView extends Component<{}, WorklogShiftViewState> {

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            targetIssueKey: "",
            timesToShift: {},
        };
    }

    public componentDidMount(): void {
        this.setState({
            worklogs: null,
            loadingError: null,
            timesToShift: {},
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
            {/*// TODO: marmer 30.09.2019 This is just a mockup with inline styles*/}
            {/*// TODO: marmer 30.09.2019 Don't use the layout of a different View in this way*/}

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
            <div className="estimationShiftContainer">
                <table>
                    <thead>
                    <tr>
                        <th align="center">Start</th>
                        <th align="center">Comment</th>
                        <th align="center">Time Spent</th>
                        <th align="center">Time to move</th>
                        <th align="center">Move</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.worklogs.map(wl => this.toRow(wl))
                    }
                    </tbody>
                </table>
                <label style={{textAlign: "center", alignSelf: "baseline", display: "flex", flexDirection: "column"}}>
                    Target
                    <input placeholder="ISSUE-1234" title="Target Issue" value={this.state.targetIssueKey}
                           onChange={e => this.setState({targetIssueKey: e.target.value})}/>
                </label>
            </div>}
        </>;
    }

    private updateTimeToShift(newValue: string, worklog: Worklog) {
        this.setState({
            timesToShift: {...this.state.timesToShift, [worklog.id]: newValue},
        });
    }
    private toRow(worklog: Worklog): ReactNode {
        // TODO: marmer 07.10.2019 No Inline styles!
        return <tr key={worklog.id}>
            <td align="center" style={{paddingRight: "0.5em"}}>
                <p>{moment(worklog.started).format("YYYY-MM-DD HH:mm:ss")}</p></td>
            <td align="center" style={{paddingRight: "0.5em"}}>
                <p>{worklog.comment}</p></td>
            <td align="center" style={{paddingRight: "0.5em"}}>
                <p>{JiraTimeService.minutesToJiraFormat(worklog.timeSpentInMinutes)}</p>
            </td>
            <td align="center" style={{paddingRight: "0.5em"}}>
                <input type="text" placeholder="5h 9m"
                       value={this.state.timesToShift[worklog.id]}
                       data-testid={"ShiftInput" + worklog.id}
                       onChange={e => this.updateTimeToShift(e.target.value, worklog)}/>
            </td>
            <td align="center" style={{paddingRight: "0.5em"}}>
                <button data-testid={"ShiftButton" + worklog.id} title="move"
                        onClick={() => this.shiftTimeFor(worklog)}
                        disabled={!this.isShiftAllowedForWorklog(worklog)}>{">"}</button>
            </td>
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
