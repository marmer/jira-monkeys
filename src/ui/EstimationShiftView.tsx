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
            {
                this.state.sourceLoadingState === "DONE" &&
                this.state.sourceEstimation &&
                <EstimationView estimation={this.state.sourceEstimation} title="Source"/>}
            {
                this.state.sourceLoadingState === "DONE" &&
                this.state.sourceEstimation &&
                <EstimationView estimation={this.state.sourceEstimation} title="Destination"/>}
            {
                this.state.sourceLoadingState === "DONE" &&
                this.state.sourceEstimation &&
                <EstimationView estimation={this.state.sourceEstimation} title="Result"/>}

        </div>;
    }
}

const EstimationView = (props: { estimation: Estimation, title: string }) => {
    return <div title={props.title} className="estimationView">
        <h2>{props.title}</h2>
        <h3>{props.estimation.issueKey}</h3>
        <label>
            Original Estimate:
            <div>{props.estimation.originalEstimate}</div>
        </label>
        <label>
            Remaining Estimate:
            <div>{props.estimation.remainingEstimate}</div>
        </label>
    </div>
};