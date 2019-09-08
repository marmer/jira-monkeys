type Unit = {
    symbol: string,
    factor: number
}

const minute = {symbol: "m", factor: 1};
const hour = {symbol: "h", factor: 60 * minute.factor};
const day = {symbol: "d", factor: 8 * hour.factor};
const week = {symbol: "w", factor: 5 * day.factor};

const weeksOf = (timeSpentInMinutes: number) => Math.floor(timeSpentInMinutes / week.factor);
const daysOf = (timeSpentInMinutes: number) => Math.floor((timeSpentInMinutes % week.factor) / day.factor);
const hoursOf = (timeSpentInMinutes: number) => Math.floor((timeSpentInMinutes % day.factor) / hour.factor);
const minutesOf = (timeSpentInMinutes: number) => Math.floor((timeSpentInMinutes % hour.factor) / minute.factor);

const minutePartOf = (timeSpentInMinutes: number): string => unitStringFor(minutesOf(timeSpentInMinutes), minute);
const hourPartOf = (timeSpentInMinutes: number): string => unitStringFor(hoursOf(timeSpentInMinutes), hour);
const dayPartOf = (timeSpentInMinutes: number): string => unitStringFor(daysOf(timeSpentInMinutes), day);
const weekPartOf = (timeSpentInMinutes: number): string => unitStringFor(weeksOf(timeSpentInMinutes), week);

const unitStringFor = (result: number, unit: Unit) => result == 0 ? "" : result + unit.symbol;

export const toJiraFormat = (timeSpentInMinutes: number) => {
    const absoluteTimeSpendInMinutes = Math.abs(timeSpentInMinutes);
    const resultString = `${weekPartOf(absoluteTimeSpendInMinutes)} ${dayPartOf(absoluteTimeSpendInMinutes)} ${hourPartOf(absoluteTimeSpendInMinutes)} ${minutePartOf(absoluteTimeSpendInMinutes)}`
        .replace(/\s+/, " ")
        .trim();
    return resultString === "" ?
        "0" + minute.symbol :
        resultString;
};

export const isValidJiraFormat = (jiraString: string): boolean => {
// TODO: marmer 08.09.2019 implement this
    return true;
};