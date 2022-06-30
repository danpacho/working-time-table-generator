import { PalleteType } from "@styles/utils/pallete";

type WorkType = "access-control" | "shuttle-operation";
const DAY_WORK_INFO: {
    time: string;
    workHour: string;
    color: string;
    borderColor: PalleteType;
    workIndex: number;
    workType: WorkType;
}[] = [
    {
        time: "09:00 ~ 10:45",
        workHour: "1시간 45분",
        color: "indigo",
        borderColor: "blue2",
        workIndex: 0,
        workType: "access-control",
    },
    {
        time: "09:30 ~ 11:30",
        workHour: "2시간",
        color: "teal",
        borderColor: "teal5",
        workIndex: 1,
        workType: "shuttle-operation",
    },
    {
        time: "10:45 ~ 12:30",
        workHour: "1시간 45분",
        color: "indigo",
        borderColor: "blue5",
        workIndex: 2,
        workType: "access-control",
    },
    {
        time: "13:30 ~ 15:30",
        workHour: "2시간",
        color: "teal",
        borderColor: "teal5",
        workIndex: 3,
        workType: "shuttle-operation",
    },
    {
        time: "13:30 ~ 17:00",
        workHour: "3시간 30분",
        color: "red",
        borderColor: "red4",
        workIndex: 4,
        workType: "access-control",
    },
];

export { DAY_WORK_INFO };
