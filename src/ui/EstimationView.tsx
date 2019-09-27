import React from "react";
import {Estimation} from "../core/EstimationCrudService";

export default ({className, estimation, readonly}: { estimation?: Estimation | null, readonly: boolean, className?: string }): React.ReactElement => {
    return <div className={className}
                title={estimation ? estimation.issueKey + ": " + estimation.issueSummary : ""}>
        <label>
            Issue <input type="text"
                         value={estimation ? estimation.issueKey : ""}
                         disabled={readonly}/>
        </label>
        <label>
            Original Estimate <input type="text"
                                     value={estimation ? estimation.originalEstimate : ""}
                                     disabled={readonly}/>
        </label>
        <label>
            Remaining Estimate <input type="text"
                                      value={estimation ? estimation.remainingEstimate : ""}
                                      disabled={readonly}/>
        </label>
    </div>;
};
