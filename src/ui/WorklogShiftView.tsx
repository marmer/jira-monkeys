import moment = require("moment");
import React, {Component, ReactNode} from "react";
import JiraTimeService from "../core/JiraTimeService";
import WorklogService, {Worklog} from "../core/WorklogService";
import EstimationView from "./EstimationView";

// TODO: marmer 27.09.2019 care!
// tslint:disable-next-line:no-empty-interface
interface WorklogShiftViewState {
    worklogs?: Worklog[] | null;
    loadingError?: Error | null;
}

export default class WorklogShiftView extends Component<{}, WorklogShiftViewState> {

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {};
    }

    public componentDidMount(): void {
        this.setState({
            worklogs: null,
            loadingError: null,
        });
        WorklogService.getWorklogsForCurrentIssueAndUser()
            .then(worklogs => this.setState({
                worklogs,
            }))
            .catch(loadingError => this.setState({
                loadingError,
            }));
    }

    public render(): React.ReactElement {
        return <>
            {/*// TODO: marmer 30.09.2019 This is just a mockup with inline styles*/}
            {/*// TODO: marmer 30.09.2019 Don't use the layout of a different View in this way*/}
            This is just work in Progress

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
                        this.state.worklogs.map(this.toRow)
                    }
                    </tbody>
                </table>
                <label style={{textAlign: "center", alignSelf: "baseline"}}>
                    Target
                    {/*// TODO: marmer 30.09.2019 Don't use the layout of a different View in this way*/}
                    <EstimationView className="estimationShiftCardContainer" readonly={true}
                                    estimation={{
                                        issueKey: "issue-1234",
                                        issueSummary: "something todo",
                                        originalEstimate: "1w 2d",
                                        remainingEstimate: "4h 15m",
                                    }}/></label>
            </div>}
        </>;
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
                       value={JiraTimeService.minutesToJiraFormat(worklog.timeSpentInMinutes)}/>
            </td>
            <td align="center" style={{paddingRight: "0.5em"}}>
                <button title="move">{">"}</button>
            </td>
        </tr>;
    }
}
