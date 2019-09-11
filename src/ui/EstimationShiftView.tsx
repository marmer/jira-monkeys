import React, {Component} from "react";
import EstimationService, {Estimation} from "../core/EstimationService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import JiraTimeService from "../core/JiraTimeService";
import "./EstimationShiftView.css";

interface EstimationShiftViewState {
    sourceIssueEstimation?: Estimation | null;
    targetIssueEstimation?: Estimation | null;
    sourceIssueEstimationState?: "LOADING" | "ERROR" | "DONE";
    targetIssueEstimationState?: "LOADING" | "ERROR" | "DONE";
    targetIssueText: string;
    timeToShiftText: string;
}

export default class EstimationShiftView extends Component<{}, EstimationShiftViewState> {
    private timer: any;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            targetIssueText: "",
            timeToShiftText: "",
        };
    }

    public getSnapshotBeforeUpdate(prevProps: Readonly<{}>, prevState: Readonly<EstimationShiftViewState>): any | null {
        if (prevState.targetIssueText !== this.state.targetIssueText) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.loadEstimations(), 750);
        }
    }

    public componentDidMount(): void {
        this.setState({
            targetIssueText: localStorage.getItem(EstimationShiftView.name + ".targetIssueText") || "",
        });
        this.loadSourceEstimations();
    }

    public setState<K extends keyof EstimationShiftViewState>(state: ((prevState: Readonly<EstimationShiftViewState>, props: Readonly<{}>) => (Pick<EstimationShiftViewState, K> | EstimationShiftViewState | null)) | Pick<EstimationShiftViewState, K> | EstimationShiftViewState | null, callback?: () => void): void {
        super.setState(state, () => {
            if (callback) {
                callback();
            }

            localStorage.setItem(EstimationShiftView.name + ".targetIssueText", this.state.targetIssueText);
        });
    }

    public render(): React.ReactElement {
        return <div className={"estimationShiftContainer"}>

            {this.state.sourceIssueEstimation &&
            <EstimationView estimation={this.state.sourceIssueEstimation} readonly={true}/>}

            {this.state.sourceIssueEstimation &&
            <div className="estimationShiftCardContainer">
                <label>
                    Issue key:
                    <input type="text"
                           placeholder="TICKET-123"
                           autoFocus={true}
                           value={this.state.targetIssueText}
                           onChange={e => this.onTargetIssueTextChange(e)}/></label>
                {this.state.targetIssueEstimation &&
                <label>
                    Time to Shift:
                    <input type="text"
                           placeholder="1w 5d 7h 30m"
                           value={this.state.timeToShiftText}
                           onChange={e => this.onTimeToShiftTextChange(e)}/></label>}
                {this.isEstimationShiftable() &&
                <button type="button" onClick={() => this.shiftEstimations()}>send</button>}
            </div>}

            {this.state.targetIssueEstimation &&
            <EstimationView estimation={this.state.targetIssueEstimation} readonly={true}/>}
        </div>;
    }
    private loadEstimations(): void {
        this.loadSourceEstimations();
        this.loadDestinationEstimations();
    }

    private loadDestinationEstimations() {
        this.setState({
            targetIssueEstimation: null,
            targetIssueEstimationState: "LOADING",
        });
        EstimationService.getEstimationsForIssue(this.state.targetIssueText)
            .then(estimation => this.setState({
                targetIssueEstimation: estimation,
                targetIssueEstimationState: "DONE",
            }))
            .catch(() => this.setState({targetIssueEstimationState: "ERROR"}));
    }

    private loadSourceEstimations() {
        this.setState({
            sourceIssueEstimation: null,
            sourceIssueEstimationState: "LOADING",
        });
        EstimationService.getEstimationsForIssue(IssueSiteInfos.getCurrentIssueKey())
            .then(estimation => this.setState({
                sourceIssueEstimation: estimation,
                sourceIssueEstimationState: "DONE",
            }))
            .catch(() => this.setState({sourceIssueEstimationState: "ERROR"}));
    }

    private onTargetIssueTextChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const targetIssueText = event.target.value;
        this.setState({
            targetIssueText,
        }, () => localStorage.setItem("targetIssue", targetIssueText));
    }

    private onTimeToShiftTextChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        this.setState({
            timeToShiftText: event.target.value,
        });
    }

    private isEstimationShiftable(): boolean {
        return !!this.state.targetIssueEstimation &&
            !!this.state.sourceIssueEstimation &&
            !!this.state.timeToShiftText &&
            JiraTimeService.isValidJiraFormat(this.state.timeToShiftText);
    }

    private shiftEstimations() {
        EstimationService.shiftEstimation({
            sourceIssueKey: this.state.sourceIssueEstimation!.issueKey,
            targetIssueKey: this.state.targetIssueEstimation!.issueKey,
            timeToShiftAsJiraString: this.state.timeToShiftText,
        })
            .then(result => {
                this.setState({
                    sourceIssueEstimation: result.sourceEstimation,
                    targetIssueEstimation: result.targetEstimation,
                });
            })
            .catch(reason => alert("Something went wrong: " + reason));

        // TODO: marmer 10.09.2019 reload page on success as soon as all the states have been remembered
    }
}

const EstimationView = (props: { estimation: Estimation, readonly: boolean }): React.ReactElement => {
    return <div className="estimationShiftCardContainer"
                title={props.estimation.issueKey + ": " + props.estimation.issueSummary}>
        <label>
            Issue: <input type="text"
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
    </div>;
};
