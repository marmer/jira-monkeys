import React from "react";
import EstimationFixService from "../core/EstimationFixService";
import IssueSiteInfos from "../core/IssueSiteInfos";
import WindowService from "../core/WindowService";

export default (): React.ReactElement => <div>
    <button
        onClick={() =>
            EstimationFixService.fixEstimationForIssue(IssueSiteInfos.getCurrentIssueKey())
                .then(() => WindowService.reloadPage())}>
        Fix estimation
    </button>
</div>;
