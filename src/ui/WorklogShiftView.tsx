import React, {Component} from "react";

// TODO: marmer 27.09.2019 care!
// tslint:disable-next-line:no-empty-interface
interface WorklogShiftViewState {
}

export default class WorklogShiftView extends Component<{}, WorklogShiftViewState> {

    constructor(props: Readonly<{}>) {
        super(props);
    }


    // Current User - get https://jira.server/rest/auth/latest/session
    //{
    //   "self": "https://jira.server/rest/api/latest/user?username=username",
    //   "name": "username",
    //   "loginInfo": {
    //     "failedLoginCount": 397,
    //     "loginCount": 18260,
    //     "lastFailedLoginTime": "2019-09-27T20:07:35.232+0200",
    //     "previousLoginTime": "2019-09-27T20:14:22.157+0200"
    //   }
    // }

    public render(): React.ReactElement {
        return <div>
            <label>
                Current User {}
            </label>
        </div>;
    }

}
