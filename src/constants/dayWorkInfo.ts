import { PalleteType } from "../styles/utils/pallete";

const DAY_WORK_INFO: {
    time: string;
    workHour: string;
    color: string;
    borderColor: PalleteType;
    workIndex: number;
}[] = [
    {
        time: "9:00 ~ 10:30",
        workHour: "1시간 30분",
        color: "indigo",
        borderColor: "blue3",
        workIndex: 0,
    },
    {
        time: "10:30 ~ 12:30",
        workHour: "2시간",
        color: "red",
        borderColor: "red3",
        workIndex: 1,
    },
    {
        time: "13:30 ~ 15:00",
        workHour: "1시간 30분",
        color: "indigo",
        borderColor: "blue3",
        workIndex: 2,
    },
    {
        time: "15:00 ~ 16:00",
        workHour: "1시간",
        color: "teal",
        borderColor: "teal4",
        workIndex: 3,
    },
    {
        time: "16:00 ~ 17:00",
        workHour: "1시간",
        color: "teal",
        borderColor: "teal4",
        workIndex: 4,
    },
];

export { DAY_WORK_INFO };
