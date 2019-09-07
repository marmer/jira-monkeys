import React, {Component} from 'react';
import EstimationService, {Estimation} from "../core/EstimationService";
import IssueSiteInfos from "../core/IssueSiteInfos";

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
        return <div>
            {/*// TODO: marmer 07.09.2019 remove the Work in Progress text*/}
            Work in Progress...
            {
                this.state.sourceLoadingState === "DONE" &&
                this.state.sourceEstimation &&
                <EstimationView estimation={this.state.sourceEstimation}/>}
        </div>;
    }
}

const EstimationView = (props: { estimation: Estimation }) => {
    return <div>
        <h2>{props.estimation.issueKey}</h2>
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