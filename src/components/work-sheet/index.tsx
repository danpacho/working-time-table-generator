import styled from "styled-components";
import media from "@styles/utils/media";
import animation from "@styles/utils/animation";

import { Exchange, Trash } from "tabler-icons-react";

import { useCallback, useEffect, useState } from "react";

import {
    ActionIcon,
    Badge,
    Button,
    Pagination,
    SimpleGrid,
    Text,
} from "@mantine/core";
import { useLocalStorageValue } from "@mantine/hooks";

import { Box } from "@components/atoms";

import { WorkInfoType } from "@core/work-gen";

import { AGENT_LIST_KEY } from "@constants/localStorageKey";
import { DAY_WORK_INFO } from "@constants/dayWorkInfo";
import { WORK_INFO } from "@constants/workInfo";

interface ExchangeInfo extends Pick<WorkInfoType<string>, "date" | "day"> {
    workName: string;
    workIndex: number;
    workTime: string;
}
interface ExchangeWorkInfo {
    start: ExchangeInfo | null;
    end: ExchangeInfo | null;
}

const getUpdatedWorkInfo = (
    workInfoArray: WorkInfoType<string>[],
    exchangeWorkInfo: ExchangeWorkInfo
) => {
    if (exchangeWorkInfo.start === null) return null;
    if (exchangeWorkInfo.end === null) return null;

    const dateArray = workInfoArray.map(({ date }) => date);
    const exchangeStartIndex = dateArray.indexOf(exchangeWorkInfo.start.date);
    const exchangeEndIndex = dateArray.indexOf(exchangeWorkInfo.end.date);

    workInfoArray[exchangeStartIndex].workSheet[exchangeWorkInfo.start.workIndex] =
        exchangeWorkInfo.end.workName;
    workInfoArray[exchangeEndIndex].workSheet[exchangeWorkInfo.end.workIndex] =
        exchangeWorkInfo.start.workName;

    return workInfoArray;
};

const ExchangeWorkContainer = styled(Box)`
    right: 8rem;
    ${media.mediumTablet} {
        right: 2rem;
    }

    animation: ${animation.popInFromBottom} 0.5s
        cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

interface WorkSheetProps {
    setWorkInfoArray: (
        val:
            | WorkInfoType<string>[]
            | ((prevState: WorkInfoType<string>[]) => WorkInfoType<string>[])
    ) => void;
    workInfoArray: WorkInfoType<string>[];
}
function WorkSheet({ workInfoArray, setWorkInfoArray }: WorkSheetProps) {
    const [activePage, setPage] = useState(1);
    const [exchangeWorkInfo, setExchangeWorkInfo] =
        useState<ExchangeWorkInfo | null>(null);
    const [worker, _] = useLocalStorageValue({
        key: AGENT_LIST_KEY,
    });

    const [isValidate, setIsValidate] = useState(false);
    const cycleNumber = worker?.length;
    useEffect(() => {
        if (WORK_INFO.WORK_PER_DAY !== cycleNumber) {
            setWorkInfoArray([]);
            setExchangeWorkInfo(null);
        } else {
            setIsValidate(true);
        }
    }, []);
    return (
        <>
            <SimpleGrid cols={cycleNumber} spacing="md">
                {isValidate &&
                    workInfoArray
                        ?.slice(
                            (activePage - 1) * cycleNumber,
                            activePage * cycleNumber
                        )
                        ?.map((workInfo) => (
                            <DayWorkSheet
                                {...workInfo}
                                exchangeWorkInfo={exchangeWorkInfo}
                                setExchangeWorkInfo={setExchangeWorkInfo}
                                key={workInfo.date}
                            />
                        ))}
            </SimpleGrid>

            {workInfoArray.length !== 0 && (
                <Pagination
                    total={workInfoArray.length / cycleNumber}
                    page={activePage}
                    onChange={setPage}
                    color="teal"
                    size="sm"
                    radius="sm"
                    withEdges
                    boundaries={3}
                    initialPage={1}
                />
            )}

            {exchangeWorkInfo?.end && exchangeWorkInfo.start && (
                <ExchangeWorkContainer
                    position="fixed"
                    top="45%"
                    display="flex"
                    flexDirection="column"
                    align="center"
                    justify="center"
                    gap=".75rem"
                    background="white"
                    shadow="shadowXxlg"
                    pAll={12}
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        align="center"
                        justify="center"
                        gap=".75rem"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            align="center"
                            justify="center"
                            gap="1rem"
                        >
                            <Text size="sm" weight="bold">
                                {exchangeWorkInfo.start.workName}
                            </Text>
                            <Badge size="xs" variant="outline" color="teal">
                                {exchangeWorkInfo.start.date}
                                {", "}
                                {exchangeWorkInfo.start.day}
                            </Badge>
                            <Button
                                size="xs"
                                variant="filled"
                                color="teal"
                                onClick={() => {
                                    const updatedWorkInfoArray = getUpdatedWorkInfo(
                                        workInfoArray,
                                        exchangeWorkInfo!
                                    );
                                    if (updatedWorkInfoArray !== null) {
                                        setWorkInfoArray(updatedWorkInfoArray);
                                        setExchangeWorkInfo(null);
                                    }
                                }}
                            >
                                업무 교환
                            </Button>
                        </Box>
                        <ActionIcon variant="hover" color="gray">
                            <Exchange size={16} />
                        </ActionIcon>

                        <Box
                            display="flex"
                            flexDirection="column"
                            align="center"
                            justify="center"
                            gap="1rem"
                        >
                            <Text size="sm" weight="bold">
                                {exchangeWorkInfo.end.workName}
                            </Text>
                            <Badge size="xs" variant="outline" color="red">
                                {exchangeWorkInfo.end.date}
                                {", "}
                                {exchangeWorkInfo.end.day}
                            </Badge>
                            <Button
                                size="xs"
                                variant="filled"
                                color="red"
                                rightIcon={<Trash size={14} />}
                                onClick={() => setExchangeWorkInfo(null)}
                            >
                                취소
                            </Button>
                        </Box>
                    </Box>
                </ExchangeWorkContainer>
            )}
        </>
    );
}

const getExchangeWorkInfo = (
    exchangeWorkInfo: ExchangeWorkInfo | null,
    newWorkInfo: ExchangeInfo
): ExchangeWorkInfo => {
    if (exchangeWorkInfo === null) {
        return {
            start: newWorkInfo,
            end: null,
        };
    }
    if (exchangeWorkInfo.start === newWorkInfo) {
        return exchangeWorkInfo;
    }
    if (
        exchangeWorkInfo.end === null &&
        exchangeWorkInfo.start?.workTime === newWorkInfo.workTime &&
        exchangeWorkInfo.start?.workName !== newWorkInfo.workName
    ) {
        return {
            start: exchangeWorkInfo.start,
            end: newWorkInfo,
        };
    }
    return exchangeWorkInfo;
};

const WorkBox = styled(Box)`
    &:hover {
        transform: scale(1.025);
    }
    &:active {
        transform: scale(0.975);
    }
`;

interface DayWorkSheetProps extends WorkInfoType<string> {
    setExchangeWorkInfo: React.Dispatch<
        React.SetStateAction<ExchangeWorkInfo | null>
    >;
    exchangeWorkInfo: ExchangeWorkInfo | null;
}

/*
WORK_INFO	[
    {"workSheet":["고웅빈","이용희","황성인","주형우"],
    "dayJsObject":"2022-07-07T15:00:00.000Z",
    "day":"금",
    "date":"2022년 07월 08일",
    "isCycleStart":true
},{
    "workSheet":["장준성","고웅빈","이용희","황성인"],
    "dayJsObject":"2022-07-10T15:00:00.000Z",
    "day":"월",
    "date":"2022년 07월 11일",
    "isCycleStart":false},{
        "workSheet":["주형우","장준성","고웅빈","이용희"],
        "dayJsObject":"2022-07-11T15:00:00.000Z",
        "day":"화","date":"2022년 07월 12일",
        "isCycleStart":false},{"workSheet":["황성인","주형우","장준성","고웅빈"],"dayJsObject":"2022-07-12T15:00:00.000Z","day":"수","date":"2022년 07월 13일","isCycleStart":false},{"workSheet":["이용희","황성인","주형우","장준성"],"dayJsObject":"2022-07-13T15:00:00.000Z","day":"목","date":"2022년 07월 14일","isCycleStart":false}]
 */
const DayWorkSheet = ({
    date,
    day,
    workSheet,
    setExchangeWorkInfo,
    exchangeWorkInfo,
    isCycleStart,
}: DayWorkSheetProps) => (
    <Box
        display="flex"
        flexDirection="column"
        align="center"
        justify="center"
        gap=".5rem"
    >
        <Box
            minWidth="max-content"
            background="white"
            color="gray9"
            fontWeight="700"
            borderRadius="bsm"
            display="flex"
            flexDirection="column"
            align="center"
            justify="center"
            gap=".15rem"
            border={{
                color: isCycleStart ? "purple5" : "gray2",
                width: isCycleStart ? "1.5px" : "1.25px",
                hover_color: isCycleStart ? "purple7" : "gray4",
            }}
            pt={4}
            pb={8}
            pr={6}
            pl={6}
        >
            <Text weight="bold" color={isCycleStart ? "violet" : "gray"} size="md">
                {day}요일
            </Text>
            <Text
                weight={isCycleStart ? "bold" : "lighter"}
                color={isCycleStart ? "violet" : "gray"}
                size="sm"
            >
                {date}
            </Text>
        </Box>

        {workSheet.map((workAgent, order) => (
            <WorkBox
                onClick={() => {
                    const info = getExchangeWorkInfo(exchangeWorkInfo, {
                        workName: workAgent,
                        workIndex: DAY_WORK_INFO[order].workIndex,
                        workTime: DAY_WORK_INFO[order].workHour,
                        date: date,
                        day,
                    });
                    setExchangeWorkInfo(info);
                }}
                display="flex"
                align="center"
                justify="center"
                flexDirection="column"
                gap=".5rem"
                width="100%"
                pb={8}
                pt={8}
                borderRadius="bsm"
                shadow="shadowXxsm"
                hover_shadow="shadowLg"
                background={
                    (exchangeWorkInfo &&
                        exchangeWorkInfo.end?.workName === workAgent &&
                        exchangeWorkInfo.end.date === date &&
                        exchangeWorkInfo.end.workIndex === order) ||
                    (exchangeWorkInfo &&
                        exchangeWorkInfo.start?.workName === workAgent &&
                        exchangeWorkInfo.start.date === date &&
                        exchangeWorkInfo.start.workIndex === order)
                        ? `${DAY_WORK_INFO[order]?.borderColor}`
                        : "white"
                }
                border={{
                    width: 0.5,
                    color: "gray2",
                    hover_color: `${DAY_WORK_INFO[order]?.borderColor}`,
                }}
                cursorPointer
                key={`${DAY_WORK_INFO[order].workIndex}-${DAY_WORK_INFO[order].workHour}-${order}`}
            >
                <Text size="sm" weight="bold">
                    {workAgent}
                </Text>
                <Box
                    display="flex"
                    flexDirection="column"
                    align="center"
                    justify="center"
                    gap=".5rem"
                    background="transparent"
                >
                    <Badge
                        size="sm"
                        variant="light"
                        color={DAY_WORK_INFO[order]?.color}
                    >
                        <Text weight="bold" size="xs">
                            {DAY_WORK_INFO[order]?.workHour}
                        </Text>
                    </Badge>
                    <Badge
                        size="sm"
                        variant="dot"
                        color={DAY_WORK_INFO[order]?.color}
                    >
                        <Text weight="bold" size="xs">
                            {DAY_WORK_INFO[order]?.time}
                        </Text>
                    </Badge>
                </Box>
            </WorkBox>
        ))}
    </Box>
);

export default WorkSheet;
