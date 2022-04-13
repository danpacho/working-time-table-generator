import { API_PARAM_CONFIG, API_RESPONSE, API_URL } from "../constants/api";
import { WORK_INFO } from "../constants/workInfo";
import { getIterationArray, shuffle } from "./array";
import { axiosGET } from "./axios";

const DAY = ["일", "월", "화", "수", "목", "금", "토"] as const;
const HOLLIDAY_INDEX = [0, 6];
type DAY_TYPE = typeof DAY[number];

const getDay = (time: string): DAY_TYPE => DAY[new Date(time).getDay()];

const addDayToString = (currentDate: Date, updateDayMount: number): string => {
    const addedDate = new Date(currentDate);
    addedDate.setDate(currentDate.getDate() + updateDayMount);

    const year = addedDate.getFullYear();
    const month = addedDate.getMonth() + 1;
    const date = addedDate.getDate();

    return `${year}-${month}-${date}`;
};

const isHolliday = (time: Date) => HOLLIDAY_INDEX.includes(time.getDay());

const getNationalHolliday = async (
    APIparams: Omit<API_PARAM_CONFIG, "ServiceKey">
) => {
    const { data } = await axiosGET<API_RESPONSE>({
        url: API_URL,
        params: {
            ServiceKey: import.meta.env.VITE_API_KEY,
            ...APIparams,
        } as API_PARAM_CONFIG,
    });
    return data;
};

const numToDate = (dateNum: number) => {
    const date = `${String(dateNum).slice(0, 4)}-${String(dateNum).slice(
        4,
        6
    )}-${String(dateNum).slice(6, 8)}`;
    return new Date(date);
};

const dateEqualizer = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const nationalHolliday = (async () =>
    await (
        await getNationalHolliday({
            _type: "json",
            numOfRows: 30,
            solYear: new Date().getFullYear(),
        })
    ).response.body.items.item.map(({ locdate }) =>
        dateEqualizer(numToDate(locdate))
    ))();

const getWorkingDay = async (startDate: Date, workerNumber: number) => {
    const extraIterationNumber =
        Math.ceil(workerNumber / WORK_INFO.WORK_PER_DAY) * workerNumber;

    const nationalHollidayData = await nationalHolliday;

    const workDayList = getIterationArray(0, workerNumber + extraIterationNumber)
        .map((dayIndex) => addDayToString(startDate, dayIndex))
        .reduce<string[]>((accWorkDayList, currDate) => {
            const date = new Date(currDate);

            if (nationalHollidayData.includes(dateEqualizer(date)))
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
const getWorkInfo = async <WorkerListType>({
    startDate,
    workPerDay,
    workerList,
}: GetWorkerInfoProps<WorkerListType>): Promise<WorkInfoType<WorkerListType>[]> => {
    const shuffledWorker = shuffle(workerList);
    const shuffledWorkerLength = shuffledWorker.length;

    const workingDay = await getWorkingDay(startDate, shuffledWorkerLength);
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
const getWorkCycleInfo = async <WorkerListType>({
    cycle,
    startDate,
    workPerDay,
    workerList,
}: GetWorkerCycleInfoProps<WorkerListType>) => {
    const cycleWorkInfo = await getIterationArray(0, cycle).reduce<
        Promise<WorkInfoType<WorkerListType>[]>
    >(
        async (
            accCycleWorkInfo,
            _,
            order
        ): Promise<WorkInfoType<WorkerListType>[]> => {
            const resolvedAccCycleWorkInfo = await accCycleWorkInfo;
            if (order === 0) {
                const firstCycleWorkInfo = await getWorkInfo({
                    startDate,
                    workPerDay,
                    workerList,
                });
                return [...resolvedAccCycleWorkInfo, ...firstCycleWorkInfo];
            }

            const lastSavedWorkDate =
                resolvedAccCycleWorkInfo[resolvedAccCycleWorkInfo.length - 1].date;
            const nextWork = await getWorkInfo({
                startDate: new Date(addDayToString(new Date(lastSavedWorkDate), 1)),
                workPerDay,
                workerList,
            });

            return [...resolvedAccCycleWorkInfo, ...nextWork];
        },
        Promise.resolve([])
    );

    return cycleWorkInfo;
};

export {
    getDay,
    isHolliday,
    getWorkInfo,
    getWorkCycleInfo,
    addDayToString,
    getNationalHolliday,
};
