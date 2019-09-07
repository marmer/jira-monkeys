import React, {Component} from 'react';
import EstimationService, {Estimation} from "../core/EstimationService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import "./EstimationShiftView.css"

interface EstimationShiftViewState {
    sourceEstimation?: Estimation
    sourceLoadingState: "LOADING" | "ERROR" | "DONE"
}

export interface EstimationShiftViewProps {

}

export default class EstimationShiftView extends Component<EstimationShiftViewProps, EstimationShiftViewState> {

    constructor(props: Readonly<EstimationShiftViewProps>) {
        super(props);
        this.state = {
            sourceLoadingState: "LOADING",
        }
    }

    componentDidMount(): void {
        this.setState({
            sourceLoadingState: "LOADING"
        });
        EstimationService.getEstimationsForIssue(IssueSiteInfos.getCurrentIssueKey())
            .then(estimation => this.setState({
                sourceEstimation: estimation,
                sourceLoadingState: "DONE"
            }))
            .catch(() => this.setState({sourceLoadingState: "ERROR"}));
    }

    render(): React.ReactElement {
        return <div className={"container"}>

            {this.state.sourceLoadingState === "DONE" &&
                this.state.sourceEstimation &&
            <EstimationView estimation={this.state.sourceEstimation}/>}

            {this.state.sourceLoadingState === "DONE" &&
                this.state.sourceEstimation &&
            <EstimationView estimation={this.state.sourceEstimation}/>}
        </div>;
    }
}

const EstimationView = (props: { estimation: Estimation }) => {
    return <div className="estimationView">
        <h3>
            {props.estimation.issueKey}
        </h3>
        <label>
            Original Estimate: <span>{props.estimation.originalEstimate}</span>
        </label>
        <label>
            Remaining Estimate: <span>{props.estimation.remainingEstimate}</span>
        </label>
    </div>
};