import { PalleteType } from "../styles/utils/pallete";

const DAY_WORK_INFO: {
    time: string;
    workHour: string;
    color: string;
    borderColor: PalleteType;
    workIndex: number;
}[] = [
    {
        time: "10:30 ~ 12:30",
        workHour: "2시간",
        color: "red",
        borderColor: "red3",
        workIndex: 0,
    },
    {
        time: "13:30 ~ 15:15",
        workHour: "1시간 45분",
        color: "indigo",
        borderColor: "blue3",
        workIndex: 1,
    },
    {
        time: "15:15 ~ 17:00",
        workHour: "1시간 45분",
        color: "indigo",
        borderColor: "blue3",
        workIndex: 2,
    },
];

export { DAY_WORK_INFO };
