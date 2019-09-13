import React, {Component} from "react";
import EstimationCrudService, {Estimation} from "../core/EstimationCrudService";
import EstimationShiftService from "../core/EstimationShiftService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import JiraTimeService from "../core/JiraTimeService";
import "./EstimationShiftView.css";
import ModalView from "./ModalView";

interface EstimationShiftViewState {
    sourceIssueEstimation?: Estimation | null;
    targetIssueEstimation?: Estimation | null;
    sourceIssueEstimationState?: "LOADING" | "ERROR" | "DONE";
    targetIssueEstimationState?: "LOADING" | "ERROR" | "DONE";
    targetIssueText: string;
    timeToShiftText: string;
    errors: string[];
}

export default class EstimationShiftView extends Component<{}, EstimationShiftViewState> {
    private timer: any;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            targetIssueText: "",
            timeToShiftText: "",
            errors: [],
        };
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
            {this.hasErrors() &&
            <ModalView onClose={() => this.clearErrors()}>
                {this.state.errors.map(error => <div key={error}>{error}</div>)}
            </ModalView>}

            {this.state.sourceIssueEstimation &&
            <EstimationView estimation={this.state.sourceIssueEstimation} readonly={true}/>}

            {this.state.sourceIssueEstimation &&
            <div className="estimationShiftCardContainer">
                <label>
                    Issue key:
                    <input type="text"
                           placeholder="ISSUE-123"
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

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<EstimationShiftViewState>, snapshot?: any): void {
        if (prevState.targetIssueText !== this.state.targetIssueText) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.loadEstimations(), 750);
        }
    }

    private hasErrors() {
        return this.state.errors.length > 0;
    }

    private loadEstimations(): void {
        this.loadSourceEstimations();
        this.loadTargetEstimations();
    }

    private loadTargetEstimations() {
        this.setState({
            targetIssueEstimation: null,
            targetIssueEstimationState: "LOADING",
        });
        EstimationCrudService.getEstimationsForIssueKey(this.state.targetIssueText)
            .then(estimation => this.setState({
                targetIssueEstimation: estimation,
                targetIssueEstimationState: "DONE",
            }))
            .catch(() => {
                this.setState({targetIssueEstimationState: "ERROR"});
            });
    }

    private loadSourceEstimations() {
        this.setState({
            sourceIssueEstimation: null,
            sourceIssueEstimationState: "LOADING",
        });
        EstimationCrudService.getEstimationsForIssueKey(IssueSiteInfos.getCurrentIssueKey())
            .then(estimation => this.setState({
                sourceIssueEstimation: estimation,
                sourceIssueEstimationState: "DONE",
            }))
            .catch(reason => {
                this.setState({sourceIssueEstimationState: "ERROR"});
                this.addError("Error on loading source Estimation: " + reason);
            });
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
        EstimationShiftService.shiftEstimation({
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
            .catch(reason => {
                this.loadEstimations();
                console.log(reason);
                this.addError("Something went wrong: " + reason);
            });
    }

    private addError(reason: string) {
        const errors = [...this.state.errors];
        errors.push(reason);
        this.setState({
            errors,
        });
    }

    private clearErrors() {
        this.setState({errors: []});
    }
}

const EstimationView = (props: { estimation: Estimation, readonly: boolean }): React.ReactElement => {
    return <div className="estimationShiftCardContainer"
                title={props.estimation.issueKey + ": " + props.estimation.issueSummary}>
        <label>
            Issue<input type="text"
                        value={props.estimation.issueKey}
                        disabled={props.readonly}/>
        </label>
        <label>
            Original Estimate<input type="text"
                                    value={props.estimation.originalEstimate}
                                    disabled={props.readonly}/>
        </label>
        <label>
            Remaining Estimate<input type="text"
                                     value={props.estimation.remainingEstimate}
                                     disabled={props.readonly}/>
        </label>
    </div>;
};
