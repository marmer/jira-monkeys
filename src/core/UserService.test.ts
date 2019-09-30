import fetchMock from "fetch-mock";
import IssueSiteInfos from "./IssueSiteInfos";
import UserService from "./UserService";

describe("UserService", () => {
    beforeEach(() => {
        fetchMock.restore();
    });
    describe("getCurrentUserName", () => {
        const currentUserUrl = "currentUserUrl";
        IssueSiteInfos.getCurrentUserUrl = jest.fn().mockReturnValue(currentUserUrl)

        it("should throw an appropriate error with the status code on an unexpected status code", async () => {
            const unexpectedStatusCode = 404;
            fetchMock.get(currentUserUrl, {
                status: unexpectedStatusCode,
            });

            expect(UserService.getCurrentUserName()).rejects.toStrictEqual(new Error("Unexpected response status: " + unexpectedStatusCode))
        });

        it("should serve the username of the current user on a successful call", async () => {
            fetchMock.get(currentUserUrl, {
                status: 200,
                body: JSON.stringify({
                        self: "selfUrl",
                        name: "mickey.mouse",
                        loginInfo: {
                            failedLoginCount: 2,
                            loginCount: 5,
                            lastFailedLoginTime: "2019-09-27T20:07:35.232+0200",
                            previousLoginTime: "2019-09-27T20:14:22.157+0200"
                        }
                    }
                )
            });
            expect(UserService.getCurrentUserName()).resolves.toStrictEqual("mickey.mouse")
        });
    });
});
