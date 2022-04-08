const getNumberBetweenMinMax = (min: number, max: number) =>
    Math.floor(Math.random() * max) + min;

const getIterationArray = (startNum: number, lastNumber: number) =>
    Array.from({ length: lastNumber + 1 }, (_, i) => i + startNum);

const shuffle = <T>(array: T[]) => {
    const arrayIndex = getIterationArray(0, array.length - 1);
    const shuffle: T[] = [];

    for (let i = 0; i < array.length; i++) {
        const randomAccessor = getNumberBetweenMinMax(0, arrayIndex.length);
        const arrayRandIndex = arrayIndex[randomAccessor];
        shuffle.push(array[arrayRandIndex]);
        arrayIndex.splice(randomAccessor, 1);
    }
    return shuffle;
};

export { getIterationArray, getNumberBetweenMinMax, shuffle };
