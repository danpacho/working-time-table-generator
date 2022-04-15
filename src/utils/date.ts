import { HOLLIDAY } from "../constants/holliday";
import { WORK_INFO } from "../constants/workInfo";
import { getIterationArray, shuffle } from "./array";

const DAY = ["일", "월", "화", "수", "목", "금", "토"] as const;
const HOLLIDAY_INDEX = [0, 6];
type DAY_TYPE = typeof DAY[number];

const getDay = (time: string): DAY_TYPE => DAY[new Date(time).getDay()];

const dateEqualizer = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const addDayToString = (currentDate: Date, updateDayMount: number): string => {
    const addedDate = new Date(currentDate);
    addedDate.setDate(currentDate.getDate() + updateDayMount);

    return dateEqualizer(addedDate);
};

const isHolliday = (time: Date) => HOLLIDAY_INDEX.includes(time.getDay());

const numToDate = (dateNum: number) => {
    const date = `${String(dateNum).slice(0, 4)}-${String(dateNum).slice(
        4,
        6
    )}-${String(dateNum).slice(6, 8)}`;
    return new Date(date);
};

const getWorkingDay = (startDate: Date, workerNumber: number) => {
    const extraIterationNumber =
        Math.ceil(workerNumber / WORK_INFO.WORK_PER_DAY) * workerNumber;
    const currentYear = String(startDate.getFullYear()) as "2022" | "2023";

    const workDayList = getIterationArray(0, workerNumber + extraIterationNumber)
        .map((dayIndex) => addDayToString(startDate, dayIndex))
        .reduce<string[]>((accWorkDayList, currDate) => {
            const date = new Date(currDate);

            if (HOLLIDAY[currentYear].includes(dateEqualizer(date)))
                return accWorkDayList;

            if (!isHolliday(date)) return [...accWorkDayList, currDate];

            if (accWorkDayList.includes(currDate)) {
                const test = addDayToString(date, 1);
                const testDate = new Date(test);
                const validatedDate = isHolliday(testDate)
                    ? addDayToString(testDate, 1)
                    : test;
                return [...accWorkDayList, validatedDate];
            }

            return accWorkDayList;
        }, []);

    return workDayList;
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
    const workInfo = getIterationArray(1, shuffledWorkerLength)
        .map((_, index) =>
            getIterationArray(workPerDay * index, workPerDay).map(
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
const getWorkCycleInfo = <WorkerListType>({
    cycle,
    startDate,
    workPerDay,
    workerList,
}: GetWorkerCycleInfoProps<WorkerListType>) => {
    const cycleWorkInfo = getIterationArray(0, cycle).reduce<
        WorkInfoType<WorkerListType>[]
    >((accCycleWorkInfo, _, order): WorkInfoType<WorkerListType>[] => {
        if (order === 0) {
            const firstCycleWorkInfo = getWorkInfo({
                startDate,
                workPerDay,
                workerList,
            });
            return [...accCycleWorkInfo, ...firstCycleWorkInfo];
        }

        const lastSavedWorkDate = accCycleWorkInfo[accCycleWorkInfo.length - 1].date;
        const nextWork = getWorkInfo({
            startDate: new Date(addDayToString(new Date(lastSavedWorkDate), 1)),
            workPerDay,
            workerList,
        });

        return [...accCycleWorkInfo, ...nextWork];
    }, []);

    return cycleWorkInfo;
};

export {
    numToDate,
    dateEqualizer,
    getDay,
    isHolliday,
    getWorkInfo,
    getWorkCycleInfo,
    addDayToString,
};
