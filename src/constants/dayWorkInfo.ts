import type { PalletType } from "@styles/utils/pallet";

//!important 반드시 workOrder를 수정 해야한다...
type WorkType = "access-control" | "shuttle-operation";
const DAY_WORK_INFO: {
    time: string | string[];
    workHour: string;
    color: string;
    borderColor: PalletType;
    workOrder: number;
    workType: WorkType;
}[] = [
    {
        time: ["09:00 ~ 12:30"],
        workHour: "3시간 30분",
        color: "indigo",
        borderColor: "blue5",
        workOrder: 0,
        workType: "access-control",
    },
    {
        time: ["13:30 ~ 16:00"],
        workHour: "2시간 30분",
        color: "indigo",
        borderColor: "blue3",
        workOrder: 1,
        workType: "access-control",
    },
];

export { DAY_WORK_INFO };
