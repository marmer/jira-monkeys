import React, {Component} from "react";
import EstimationFixService from "../core/EstimationFixService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import WindowService from "../core/WindowService";
import ModalView from "./ModalView";

interface EstimationFixViewState {
    errorMessage?: string | null;
}

export default class EstimationFixView extends Component<{}, EstimationFixViewState> {

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactElement {
        return <div>
            <button
                onClick={() =>
                    EstimationFixService.fixEstimationForIssue(IssueSiteInfos.getCurrentIssueKey())
                        .then(() => WindowService.reloadPage())
                        .catch(() => this.setState({errorMessage: "An unexpected error occurred while fixing the estimations. The page is getting reloaded on closing this message. Check the estimation afterwards"}))}>
                Fix estimation
            </button>
            {this.state.errorMessage && <ModalView onClose={WindowService.reloadPage}>
                {this.state.errorMessage}
            </ModalView>}
        </div>;
    }

}
