import dayjs from "dayjs";

import { HOLLIDAY } from "@constants/holliday";
import { WORK_INFO } from "@constants/workInfo";
import { getIterationArray, shift, shuffle } from "@core/array";

const DAY = ["일", "월", "화", "수", "목", "금", "토"] as const;
const HOLLIDAY_INDEX = [0, 6];
type DAY_TYPE = typeof DAY[number];

const getDay = (time: string): DAY_TYPE => DAY[new Date(time).getDay()];

const dateEqualizer = (date: dayjs.Dayjs) =>
    `${date.get("year")}-${date.get("month") + 1}-${date.get("date")}`;

const addDayToString = (currentDate: dayjs.Dayjs, updateDayMount: number) =>
    currentDate.add(updateDayMount, "day");

const isHolliday = (time: dayjs.Dayjs) => HOLLIDAY_INDEX.includes(time.day());

const numToDate = (dateNum: number) => {
    const date = `${String(dateNum).slice(0, 4)}-${String(dateNum).slice(
        4,
        6
    )}-${String(dateNum).slice(6, 8)}`;
    return dayjs(date);
};

const getWorkingDay = (
    startDate: dayjs.Dayjs,
    workerNumber: number
): dayjs.Dayjs[] => {
    const extraIterationNumber =
        Math.ceil(workerNumber / WORK_INFO.WORK_PER_DAY) * workerNumber;
    const currentYear = String(new Date().getFullYear()) as "2022" | "2023";
    const workDayList = getIterationArray(0, workerNumber + extraIterationNumber)
        .map((dayIndex) => addDayToString(startDate, dayIndex))
        .reduce<dayjs.Dayjs[]>((accWorkDayList, currDate) => {
            const date = dayjs(currDate);

            if (HOLLIDAY[currentYear].includes(dateEqualizer(date)))
                return accWorkDayList;

            if (!isHolliday(date)) return [...accWorkDayList, currDate];

            if (accWorkDayList.includes(currDate)) {
                const test = addDayToString(date, 1);
                const testDate = dayjs(test);
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
    startDate: dayjs.Dayjs;
    workPerDay: number;
}
export interface WorkInfoType<WorkerListType> {
    workSheet: WorkerListType[];
    dayJsObject: dayjs.Dayjs;
    date: string;
    day: "일" | "월" | "화" | "수" | "목" | "금" | "토";
    isCycleStart: boolean;
}
const getWorkInfo = <WorkerListType>({
    startDate,
    workPerDay,
    workerList,
}: GetWorkerInfoProps<WorkerListType>): WorkInfoType<WorkerListType>[] => {
    const shuffledWorker = shuffle(workerList);
    const shuffledWorkerLength = shuffledWorker.length;

    const workingDayArray = getWorkingDay(startDate, shuffledWorkerLength);

    const isWorkDuplicated = shuffledWorkerLength % workPerDay === 0;

    const workSheetArray = isWorkDuplicated
        ? getIterationArray(1, shuffledWorkerLength).map((_, index) =>
              shift(
                  getIterationArray(workPerDay * index, workPerDay).map(
                      (index) => shuffledWorker[index % shuffledWorkerLength]
                  ),
                  index * 2 + 1
              )
          )
        : getIterationArray(1, shuffledWorkerLength).map((_, index) =>
              getIterationArray(workPerDay * index, workPerDay).map(
                  (index) => shuffledWorker[index % shuffledWorkerLength]
              )
          );
    const workInfo = workSheetArray.map((workSheet, dayIndex) => {
        return {
            workSheet,
            dayJsObject: workingDayArray[dayIndex],
            day: DAY[workingDayArray[dayIndex]?.day()],
            date: workingDayArray[dayIndex].format("YYYY년 MM월 DD일"),
            isCycleStart: dayIndex === 0,
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

        const lastSavedWorkDate =
            accCycleWorkInfo[accCycleWorkInfo.length - 1].dayJsObject;
        const nextWork = getWorkInfo({
            startDate: addDayToString(lastSavedWorkDate, 1),
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
