export default class WindowService {
    public static getWindowLocationPathname(): string {
        return window.location.pathname;
    }

    public static getWindowLocationOrigin(): string {
        return window.location.origin;
    }
}
