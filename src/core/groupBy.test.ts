import groupBy from "./groupBy";

describe('groupBy', () => {
    it('should group multiple and single elements together by the key extractor', () => {
        type ComplexType = {
            innerType: {
                keyField: string
            }

            someOtherValue: number;
        }

        const inputValues: Array<ComplexType> = [{
            innerType: {
                keyField: "a"
            },
            someOtherValue: 1
        }, {
            innerType: {
                keyField: "b"
            },
            someOtherValue: 2
        }, {
            innerType: {
                keyField: "a"
            },
            someOtherValue: 3
        }];

        const group = groupBy(inputValues, (k: ComplexType) => k.innerType.keyField);

        expect(group).toStrictEqual([{
            key: "a",
            values: [
                {
                    innerType: {
                        keyField: "a"
                    },
                    someOtherValue: 1
                }, {
                    innerType: {
                        keyField: "a"
                    },
                    someOtherValue: 3
                }]
        }, {
            key: "b",
            values: [
                {
                    innerType: {
                        keyField: "b"
                    },
                    someOtherValue: 2
                }]
        }]);

    });
});