const getNumberBetweenMinMax = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

const getIterationArray = (startNum: number, lastNumber: number) =>
    Array.from({ length: lastNumber }, (_, i) => i + startNum);

const shuffle = <T>(array: T[]) => {
    const arrayIndex = getIterationArray(0, array.length);
    const shuffle: T[] = [];

    for (let i = 0; i < array.length; i++) {
        const randomAccessor = getNumberBetweenMinMax(0, arrayIndex.length - 1);
        const arrayRandIndex = arrayIndex[randomAccessor];
        shuffle.push(array[arrayRandIndex]);
        arrayIndex.splice(randomAccessor, 1);
    }
    return shuffle;
};

const shift = <T>(array: T[], shifMount: number) => {
    const arrayLength = array.length;
    if (shifMount <= 0) {
        throw Error(`shifted mount ${shifMount} is not valid! Min mount is 1`);
    }
    const shiftedBefore = array.slice(arrayLength - shifMount, arrayLength);
    const shiftedAfter = array.slice(0, arrayLength - shifMount);
    return [...shiftedBefore, ...shiftedAfter];
};

export { getIterationArray, getNumberBetweenMinMax, shuffle, shift };
