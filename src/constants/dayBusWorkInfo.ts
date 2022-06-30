import { PalleteType } from "@styles/utils/pallete";

const DAY_BUS_WORK_INFO: {
    time: string;
    workHour: string;
    color: string;
    borderColor: PalleteType;
    workIndex: number;
}[] = [
    {
        time: "09:30 ~ 11:30",
        workHour: "2시간",
        color: "teal",
        borderColor: "teal5",
        workIndex: 0,
    },
    {
        time: "13:30 ~ 15:15",
        workHour: "1시간 45분",
        color: "teal",
        borderColor: "teal5",
        workIndex: 1,
    },
];

export { DAY_BUS_WORK_INFO };
