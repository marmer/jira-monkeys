import React, {Component} from 'react';
import WorklogService, {Worklog} from "../core/WorklogService";
import jiraFormat from "../core/jiraFormat";

interface WorklogSummarizerViewState {
    loadingState: "LOADING" | "DONE" | "ERROR",
    worklogs: Worklog[]
}


export interface WorklogSummarizerViewProps {

}

export default class WorklogSummarizerView extends Component<WorklogSummarizerViewProps, WorklogSummarizerViewState> {

    constructor(props: Readonly<WorklogSummarizerViewProps>) {
        super(props);
        this.state = {
            loadingState: "LOADING",
            worklogs: []
        };

        this.loadSummedBookings();
    }

    render(): React.ReactElement {
        return <div>
            <h1>Worklogs summarized per User</h1>
            {this.state.loadingState === "ERROR" && "Error"}
            {this.state.loadingState === "LOADING" && "Loading"}
            {this.state.loadingState === "DONE" && this.state.worklogs.map(worklog =>
                <div key={worklog.author.displayName}>
                    {worklog.author.displayName} => {jiraFormat(worklog.timeSpentInMinutes)}
                </div>)}
        </div>;
    }

    private loadSummedBookings() {
        this.setState({
            loadingState: "LOADING",
            worklogs: []
        });
        WorklogService.getSummedWorklogsByUser()
            .then(worklogs => this.setState({
                loadingState: "DONE",
                worklogs: worklogs
            }))
            .catch(reason => {
                this.setState({loadingState: "ERROR"})
                return console.error(reason);
            })
    }

}
