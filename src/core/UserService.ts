import IssueSiteInfos from "./IssueSiteInfos";

export default class UserService {
    public static async getCurrentUserName(): Promise<string> {
        const response = await fetch(IssueSiteInfos.getCurrentUserUrl());
        if (response.status !== 200) {
            throw new Error("Unexpected response status: " + response.status);
        }
        const responseJson = await response.json();
        return responseJson.name;
    }
}
