import type { PalleteType } from "@styles/utils/pallete";

type WorkType = "access-control" | "shuttle-operation";
const DAY_WORK_INFO: {
    time: string | string[];
    workHour: string;
    color: string;
    borderColor: PalleteType;
    workOrder: number;
    workType: WorkType;
}[] = [
    {
        time: ["09:00 ~ 10:45", "13:30 ~ 15:15"],
        workHour: "3시간 30분",
        color: "indigo",
        borderColor: "blue3",
        workOrder: 0,
        workType: "access-control",
    },
    {
        time: ["10:45 ~ 12:30", "15:15 ~ 17:00"],
        workHour: "3시간 30분",
        color: "indigo",
        borderColor: "blue3",
        workOrder: 1,
        workType: "access-control",
    },
    {
        time: ["09:30 ~ 11:30", "13:30 ~ 15:30"],
        workHour: "4시간",
        color: "teal",
        borderColor: "teal4",
        workOrder: 2,
        workType: "shuttle-operation",
    },
];

export { DAY_WORK_INFO };
