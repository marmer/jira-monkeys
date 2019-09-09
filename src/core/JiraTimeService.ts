type Unit = {
    symbol: string,
    factor: number
}

const jiraSymbolFactorMap: {
    [symbol: string]: Unit;
} = {};

const minute: Unit = jiraSymbolFactorMap["m"] = {symbol: "m", factor: 1};
const hour: Unit = jiraSymbolFactorMap["h"] = {symbol: "h", factor: 60 * minute.factor};
const day: Unit = jiraSymbolFactorMap["d"] = {symbol: "d", factor: 8 * hour.factor};
const week: Unit = jiraSymbolFactorMap["w"] = {symbol: "w", factor: 5 * day.factor};

export default class JiraTimeService {
    public static toJiraFormat(timeSpentInMinutes: number) {
        const absoluteTimeSpendInMinutes = Math.abs(timeSpentInMinutes);
        const resultString = `${this.weekPartOf(absoluteTimeSpendInMinutes)} ${this.dayPartOf(absoluteTimeSpendInMinutes)} ${this.hourPartOf(absoluteTimeSpendInMinutes)} ${this.minutePartOf(absoluteTimeSpendInMinutes)}`
            .replace(/\s+/, " ")
            .trim();
        return resultString === "" ?
            "0" + minute.symbol :
            resultString;
    };

    public static isValidJiraFormat(jiraString: string): boolean {
        const unitSymbols: string = Object.keys(jiraSymbolFactorMap).join();
        return new RegExp("^\\s*\\d+[" + unitSymbols + "](\\s+\\d+[" + unitSymbols + "])*?\\s*$").test(jiraString);
    };

    private static weeksOf(timeSpentInMinutes: number): number {
        return Math.floor(timeSpentInMinutes / week.factor)
    };

    private static daysOf(timeSpentInMinutes: number): number {
        return Math.floor((timeSpentInMinutes % week.factor) / day.factor)
    };

    private static hoursOf(timeSpentInMinutes: number): number {
        return Math.floor((timeSpentInMinutes % day.factor) / hour.factor)
    };

    private static minutesOf(timeSpentInMinutes: number): number {
        return Math.floor((timeSpentInMinutes % hour.factor) / minute.factor)
    };

    private static minutePartOf(timeSpentInMinutes: number): string {
        return this.unitStringFor(this.minutesOf(timeSpentInMinutes), minute)
    };

    private static hourPartOf(timeSpentInMinutes: number): string {
        return this.unitStringFor(this.hoursOf(timeSpentInMinutes), hour)
    };

    private static dayPartOf(timeSpentInMinutes: number): string {
        return this.unitStringFor(this.daysOf(timeSpentInMinutes), day)
    };

    private static weekPartOf(timeSpentInMinutes: number): string {
        return this.unitStringFor(this.weeksOf(timeSpentInMinutes), week)
    };

    private static unitStringFor(result: number, unit: Unit): string {
        return result == 0 ? "" : result + unit.symbol
    };
}


