export type Tupel<K, V> = { key: K, values: V };

export default <V, K>(values: V[], keyExtractor: (value: V) => K): Tupel<K, V[]>[] => {
    const intermediateGroup: { [key: string]: Tupel<K, V[]> } = {};

    values.forEach(value => {
        const key = keyExtractor(value);
        const indexKey = "" + key;
        if (!intermediateGroup[indexKey]) {
            intermediateGroup[indexKey] = {key: key, values: []};
        }
        intermediateGroup[indexKey].values.push(value)
    });

    const result: Tupel<K, V[]>[] = [];

    Object.keys(intermediateGroup)
        .forEach(key => result.push(intermediateGroup[key]));

    return result;
}