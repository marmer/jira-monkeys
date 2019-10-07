import moment = require("moment");
import React, {Component, ReactNode} from "react";
import JiraTimeService from "../core/JiraTimeService";
import WorklogService, {Worklog} from "../core/WorklogService";
import EstimationView from "./EstimationView";

// TODO: marmer 27.09.2019 care!
// tslint:disable-next-line:no-empty-interface
interface WorklogShiftViewState {
    worklogs: Worklog[];
}

export default class WorklogShiftView extends Component<{}, WorklogShiftViewState> {

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            worklogs: [],
        };
    }

    public componentDidMount(): void {
        WorklogService.getWorklogsForCurrentIssueAndUser()
            .then(worklogs => this.setState({worklogs}));
    }

    public render(): React.ReactElement {
        return <>
            {/*// TODO: marmer 30.09.2019 This is just a mockup with inline styles*/}
            {/*// TODO: marmer 30.09.2019 Don't use the layout of a different View in this way*/}
            This is just work in Progress
            <div className="estimationShiftContainer">
                <table>
                    <thead>
                    <tr>
                        <th>Author</th>
                        <th>Comment</th>
                        <th>Start</th>
                        <th>Time Spent</th>
                        <th>Time to move</th>
                        <th>Move</th>
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
            </div>
        </>;
    }

    private toRow(worklog: Worklog): ReactNode {

        return <tr key={worklog.id}>
            <td><input style={{textAlign: "center"}} type="text" disabled={true}
                       value={worklog.author.displayName}/></td>
            <td><input style={{textAlign: "center"}} type="text" disabled={true}
                       value={worklog.comment}/></td>
            <td><input style={{textAlign: "center"}} type="text" disabled={true}
                       value={moment(worklog.started).format("YYYY-MM-DD HH:mm:ss")}/></td>
            <td><input style={{textAlign: "center"}} type="text" disabled={true}
                       value={JiraTimeService.minutesToJiraFormat(worklog.timeSpentInMinutes)}/></td>
            <td><input style={{textAlign: "center"}} type="text" placeholder="5h 9m"
                       value={JiraTimeService.minutesToJiraFormat(worklog.timeSpentInMinutes)}/>
            </td>
            <td>
                <button title="move">{">"}</button>
            </td>
        </tr>;
    }
}
