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
    sourceIssueEstimationState?: "LOADING" | "ERROR" | "DONE" | "SENDING";
    targetIssueEstimationState?: "LOADING" | "ERROR" | "DONE" | "SENDING";
    targetIssueText: string;
    timeToShiftText: string;
    errorMessages: string[];
}

export default class EstimationShiftView extends Component<{}, EstimationShiftViewState> {
    private timer: any;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            targetIssueText: "",
            timeToShiftText: "",
            errorMessages: [],
        };
    }

    public componentDidMount(): void {
        this.setState({
            targetIssueText: sessionStorage.getItem(EstimationShiftView.name + ".targetIssueText") || "",
        });
        this.loadSourceEstimation();
    }

    public setState<K extends keyof EstimationShiftViewState>(state: ((prevState: Readonly<EstimationShiftViewState>, props: Readonly<{}>) => (Pick<EstimationShiftViewState, K> | EstimationShiftViewState | null)) | Pick<EstimationShiftViewState, K> | EstimationShiftViewState | null, callback?: () => void): void {
        super.setState(state, () => {
            if (callback) {
                callback();
            }

            sessionStorage.setItem(EstimationShiftView.name + ".targetIssueText", this.state.targetIssueText);
        });
    }

    public render(): React.ReactElement {
        return <div className={"estimationShiftContainer"}>
            {this.hasErrorMessages() &&
            <ModalView onClose={() => this.clearErrors()}>
                {this.state.errorMessages.map(error => <div key={error}>{error}</div>)}
            </ModalView>}

            <EstimationView estimation={this.state.sourceIssueEstimation} readonly={true}/>

            <div className="estimationShiftCardContainer">
                <label>
                    Issue key <input type="text"
                                     placeholder="ISSUE-123"
                                     autoFocus={true}
                                     value={this.state.targetIssueText}
                                     onChange={e => this.onTargetIssueTextChange(e)}/></label>
                <label>
                    Time to shift <input disabled={!this.state.targetIssueEstimation}
                                         type="text"
                                         placeholder="1w 5d 7h 30m"
                                         value={this.state.timeToShiftText}
                                         onChange={e => this.onTimeToShiftTextChange(e)}/></label>
                <div className="shiftButtons">
                    <button type="button" onClick={() => this.fetchEstimation()}
                            disabled={!this.isEstimationShiftable()} title="fetch">{"<"}
                    </button>
                    <button type="button" onClick={() => this.sendEstimation()}
                            disabled={!this.isEstimationShiftable()} title="send">{">"}
                    </button>
                </div>
            </div>

            {this.state.targetIssueEstimation &&
            <EstimationView estimation={this.state.targetIssueEstimation} readonly={true}/>}
        </div>;
    }

    public componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<EstimationShiftViewState>, snapshot?: any): void {
        if (prevState.targetIssueText !== this.state.targetIssueText) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.loadEstimations(), 750);
        }
    }

    private hasErrorMessages() {
        return this.state.errorMessages.length > 0;
    }

    private loadEstimations(): void {
        this.loadSourceEstimation();
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
                this.setState({
                    targetIssueEstimationState: "ERROR",
                    targetIssueEstimation: this.getErrorEstimationForIssueKey(this.state.targetIssueText),
                });
            });
    }

    private loadSourceEstimation() {
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
                this.setState({
                    sourceIssueEstimationState: "ERROR",
                    sourceIssueEstimation: this.getErrorEstimationForIssueKey(IssueSiteInfos.getCurrentIssueKey()),
                });
            });
    }

    private getErrorEstimationForIssueKey(issueKey: string): Estimation {
        return {
            issueKey,
            remainingEstimate: "Error",
            originalEstimate: "Error",
            issueSummary: "Error",
        };
    }

    private onTargetIssueTextChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const targetIssueText = event.target.value;
        this.setState({
            targetIssueText,
        }, () => sessionStorage.setItem("targetIssue", targetIssueText));
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
            this.state.sourceIssueEstimationState === "DONE" &&
            this.state.targetIssueEstimationState === "DONE" &&
            JiraTimeService.isValidJiraFormat(this.state.timeToShiftText);
    }

    private sendEstimation() {
        this.setState({
            targetIssueEstimationState: "SENDING",
            sourceIssueEstimationState: "SENDING",
        });
        EstimationShiftService.shiftEstimation({
            sourceIssueKey: this.state.sourceIssueEstimation!.issueKey,
            targetIssueKey: this.state.targetIssueEstimation!.issueKey,
            timeToShiftAsJiraString: this.state.timeToShiftText,
        })
            .then(result => {
                this.setState({
                    sourceIssueEstimation: result.sourceEstimation,
                    targetIssueEstimation: result.targetEstimation,
                    targetIssueEstimationState: "DONE",
                    sourceIssueEstimationState: "DONE",
                });
            })
            .catch(reason => {
                this.loadEstimations();
                console.error(reason);
                this.addError("Something went wrong while sending: " + reason);
            });
    }

    private fetchEstimation() {
        this.setState({
            targetIssueEstimationState: "SENDING",
            sourceIssueEstimationState: "SENDING",
        });
        EstimationShiftService.shiftEstimation({
            sourceIssueKey: this.state.targetIssueEstimation!.issueKey,
            targetIssueKey: this.state.sourceIssueEstimation!.issueKey,
            timeToShiftAsJiraString: this.state.timeToShiftText,
        })
            .then(result => {
                this.setState({
                    sourceIssueEstimation: result.targetEstimation,
                    targetIssueEstimation: result.sourceEstimation,
                    targetIssueEstimationState: "DONE",
                    sourceIssueEstimationState: "DONE",
                });
            })
            .catch(reason => {
                this.loadEstimations();
                console.log(reason);
                this.addError("Something went wrong while fetching: " + reason);
            });
    }

    private addError(reason: string) {
        const errorMessages = [...this.state.errorMessages];
        errorMessages.push(reason);
        this.setState({
            errorMessages,
        });
    }

    private clearErrors() {
        this.setState({errorMessages: []});
    }
}

const EstimationView = (props: { estimation?: Estimation | null, readonly: boolean }): React.ReactElement => {
    return <div className="estimationShiftCardContainer"
                title={props.estimation ? props.estimation.issueKey + ": " + props.estimation.issueSummary : ""}>
        <label>
            Issue <input type="text"
                         value={props.estimation ? props.estimation.issueKey : ""}
                         disabled={props.readonly}/>
        </label>
        <label>
            Original Estimate <input type="text"
                                     value={props.estimation ? props.estimation.originalEstimate : ""}
                                     disabled={props.readonly}/>
        </label>
        <label>
            Remaining Estimate <input type="text"
                                      value={props.estimation ? props.estimation.remainingEstimate : ""}
                                      disabled={props.readonly}/>
        </label>
    </div>;
};
