export default class WindowService {
    public static reloadPage(): void {
        window.location.reload();
    }
    public static getWindowLocationPathname(): string {
        return window.location.pathname;
    }

    public static getWindowLocationOrigin(): string {
        return window.location.origin;
    }
}
