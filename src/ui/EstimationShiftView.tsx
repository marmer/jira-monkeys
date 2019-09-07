import React, {Component} from 'react';
import EstimationService, {Estimation} from "../core/EstimationService";
import "./EstimationShiftView.css"
import IssueSiteInfos from "../core/IssueSiteInfos";

interface EstimationShiftViewState {
    sourceIssueEstimation?: Estimation | null
    targetIssueEstimation?: Estimation | null
    sourceIssueEstimationState?: "LOADING" | "ERROR" | "DONE" | null
    targetIssueEstimationState?: "LOADING" | "ERROR" | "DONE" | null
    targetIssueText: string
    timeToShiftText: string
}

export interface EstimationShiftViewProps {

}

export default class EstimationShiftView extends Component<EstimationShiftViewProps, EstimationShiftViewState> {

    constructor(props: Readonly<EstimationShiftViewProps>) {
        super(props);
        this.state = {
            targetIssueText: "",
            timeToShiftText: ""
        }
    }

    getSnapshotBeforeUpdate(prevProps: Readonly<EstimationShiftViewProps>, prevState: Readonly<EstimationShiftViewState>): any | null {
        if (prevState.targetIssueText !== this.state.targetIssueText) {
            this.loadEstimations();
        }
    }

    render(): React.ReactElement {
        return <div className={"estimationShiftContainer"}>
            Work in Progress ... coming soon;)
            <div className="estimationShiftCardContainer">
                <label>
                    Issue key:
                    <input type="text"
                           placeholder="TICKET-123"
                           value={this.state.targetIssueText}
                           onChange={e => this.onDestinationIssueTextChange(e)}/></label>
                <label>
                    {/*// TODO: marmer 07.09.2019 Show only when destination issue exists!*/}
                    Time to Shift:
                    <input type="text"
                           placeholder="1w 5d 7h 30m"
                           value={this.state.timeToShiftText}
                           onChange={e => this.onTimeToShiftTextChange(e)}/></label>
                {/*// TODO: marmer 07.09.2019 Show (and enable) only when destination issue exists and time to shift value is valid!*/}
                <button type="button">send</button>
            </div>
            {this.state.sourceIssueEstimationState === "DONE" &&
            this.state.sourceIssueEstimation &&
            <EstimationView estimation={this.state.sourceIssueEstimation} readonly={true}/>}
            {this.state.targetIssueEstimationState === "DONE" &&
            this.state.targetIssueEstimation &&
            <EstimationView estimation={this.state.targetIssueEstimation} readonly={true}/>}
        </div>;
    }

    private loadEstimations(): void {
        this.loadSourceEstimations();
        this.loadDestinationEstimations();
    }

    private loadDestinationEstimations() {
        this.setState({
            targetIssueEstimationState: "LOADING"
        });
        EstimationService.getEstimationsForIssue(this.state.targetIssueText)
            .then(estimation => this.setState({
                targetIssueEstimation: estimation,
                targetIssueEstimationState: "DONE"
            }))
            .catch(() => this.setState({targetIssueEstimationState: "ERROR"}));
    }

    private loadSourceEstimations() {
        this.setState({
            sourceIssueEstimationState: "LOADING"
        });
        EstimationService.getEstimationsForIssue(IssueSiteInfos.getCurrentIssueKey())
            .then(estimation => this.setState({
                sourceIssueEstimation: estimation,
                sourceIssueEstimationState: "DONE"
            }))
            .catch(() => this.setState({sourceIssueEstimationState: "ERROR"}));
    }

    private onDestinationIssueTextChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        this.setState({
            targetIssueText: event.target.value
        });
    }

    private onTimeToShiftTextChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        this.setState({
            timeToShiftText: event.target.value
        });
    }
}

const EstimationView = (props: { estimation: Estimation, readonly: boolean }): React.ReactElement => {
    return <div className="estimationShiftCardContainer"
                title={props.estimation.issueKey + ": " + props.estimation.issueSummary}>
        <label>
            Ticket: <input type="text"
                           value={props.estimation.issueKey}
                           disabled={props.readonly}/>
        </label>
        <label>
            Original Estimate: <input type="text"
                                      value={props.estimation.originalEstimate}
                                      disabled={props.readonly}/>
        </label>
        <label>
            Remaining Estimate: <input type="text"
                                       value={props.estimation.remainingEstimate}
                                       disabled={props.readonly}/>
        </label>
    </div>
};