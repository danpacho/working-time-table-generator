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

const DAY = ["일", "월", "화", "수", "목", "금", "토"] as const;
const HOLLIDAY_INDEX = [0, 6];
type DAY_TYPE = typeof DAY[number];

const getDay = (time: string): DAY_TYPE => DAY[new Date(time).getDay()];

const isHolliday = (time: Date) => HOLLIDAY_INDEX.includes(time.getDay());

const getWorkingDay = (startDate: Date, workerNumber: number) => {
    const extraIterationNumber = Math.ceil(workerNumber / 5) * 2;
    const workDayList = getIterationArray(0, workerNumber + extraIterationNumber)
        .map((dayIndex) => addDayToString(startDate, dayIndex))
        .reduce<string[]>((acc, currDate) => {
            const date = new Date(currDate);

            if (!isHolliday(date)) {
                return [...acc, currDate];
            }

            if (acc.includes(currDate)) {
                const test = addDayToString(date, 1);
                const testDate = new Date(test);
                const validatedDate = isHolliday(testDate)
                    ? addDayToString(testDate, 1)
                    : test;
                return [...acc, validatedDate];
            }

            return acc;
        }, []);
    return workDayList;
};

const addDayToString = (currentDate: Date, updateDayMount: number): string => {
    const addedDate = new Date(currentDate);
    addedDate.setDate(currentDate.getDate() + updateDayMount);

    const year = addedDate.getFullYear();
    const month = addedDate.getMonth() + 1;
    const date = addedDate.getDate();

    return `${year}-${month}-${date}`;
};

interface GetWorkerInfoProps<WorkerListType> {
    workerList: WorkerListType[];
    startDate: Date;
    workPerDay: number;
}
export interface WorkInfoType<WorkerListType> {
    workSheet: WorkerListType[];
    date: string;
    day: "일" | "월" | "화" | "수" | "목" | "금" | "토";
}
const getWorkInfo = <WorkerListType>({
    startDate,
    workPerDay,
    workerList,
}: GetWorkerInfoProps<WorkerListType>): WorkInfoType<WorkerListType>[] => {
    const shuffledWorker = shuffle(workerList);
    const shuffledWorkerLength = shuffledWorker.length;

    const workingDay = getWorkingDay(startDate, shuffledWorkerLength);
    const workInfo = getIterationArray(1, shuffledWorkerLength - 1)
        .map((_, index) =>
            getIterationArray(workPerDay * index, workPerDay - 1).map(
                (index) => shuffledWorker[index % shuffledWorkerLength]
            )
        )
        .map((workSheet, dayIndex) => {
            return {
                workSheet,
                date: workingDay[dayIndex],
                day: getDay(workingDay[dayIndex]),
            };
        });
    return workInfo;
};

interface GetWorkerCycleInfoProps<WorkerListType>
    extends GetWorkerInfoProps<WorkerListType> {
    cycle: number;
}
const getWorkCycleInfo = <T>({
    cycle,
    startDate,
    workPerDay,
    workerList,
}: GetWorkerCycleInfoProps<T>) => {
    const cycleWorkInfo = getIterationArray(0, cycle - 1).reduce<WorkInfoType<T>[]>(
        (accCycleWorkInfo, _, order) => {
            if (order === 0) {
                accCycleWorkInfo.push(
                    ...getWorkInfo({
                        startDate,
                        workPerDay,
                        workerList,
                    })
                );
                return accCycleWorkInfo;
            }

            const lastWorkDate = accCycleWorkInfo[accCycleWorkInfo.length - 1].date;
            accCycleWorkInfo.push(
                ...getWorkInfo({
                    startDate: new Date(addDayToString(new Date(lastWorkDate), 1)),
                    workPerDay,
                    workerList,
                })
            );
            return accCycleWorkInfo;
        },
        []
    );

    return cycleWorkInfo;
};

export { getDay, isHolliday, getWorkInfo, getWorkCycleInfo, addDayToString };
