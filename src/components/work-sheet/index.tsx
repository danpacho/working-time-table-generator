import styled from "styled-components";
import media from "@styles/utils/media";
import animation from "@styles/utils/animation";

import { Exchange, Trash } from "tabler-icons-react";

import { useEffect, useState } from "react";

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
    workOrder: number;
    workTime: string;
}
interface ExchangeWorkInfo {
    start: ExchangeInfo | null;
    end: ExchangeInfo | null;
}

const getUpdatedWorkInfo = (
    workInfoArray: WorkInfoType<string>[],
    exchangeWorkInfo: ExchangeWorkInfo
): {
    isValidate: true | false;
    updatedWorkInfoArray: WorkInfoType<string>[] | null;
} => {
    if (exchangeWorkInfo.start === null || exchangeWorkInfo.end === null)
        return {
            isValidate: false,
            updatedWorkInfoArray: null,
        };

    const { start, end } = exchangeWorkInfo;

    const dateInfo = workInfoArray.map(({ date }) => date);
    const exchangeStartIndex = dateInfo.indexOf(start.date);
    const exchangeEndIndex = dateInfo.indexOf(end.date);

    workInfoArray[exchangeStartIndex].workSheet[start.workOrder] = end.workName;
    workInfoArray[exchangeEndIndex].workSheet[end.workOrder] = start.workName;

    return {
        isValidate: true,
        updatedWorkInfoArray: workInfoArray,
    };
};

const ExchangeWorkContainer = styled(Box)`
    right: 8rem;
    ${media.mediumTablet} {
        right: 2rem;
    }

    animation: ${animation.fadeIn} 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
        const isDataExist = workInfoArray?.length >= 1;
        if (isDataExist) {
            if (workInfoArray[0].workSheet.length !== WORK_INFO.WORK_PER_DAY) {
                setWorkInfoArray([]);
                setExchangeWorkInfo(null);
                setIsValidate(false);
            } else {
                setIsValidate(true);
            }
        } else {
            setIsValidate(true);
        }
    }, [workInfoArray]);

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
                                    const { updatedWorkInfoArray, isValidate } =
                                        getUpdatedWorkInfo(
                                            workInfoArray,
                                            exchangeWorkInfo!
                                        );

                                    if (!isValidate) {
                                        setExchangeWorkInfo(null);
                                    }
                                    if (isValidate) {
                                        setWorkInfoArray(updatedWorkInfoArray!);
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

        {workSheet.map((workAgent, order) => {
            const { workType, workHour, workOrder, time, color, borderColor } =
                DAY_WORK_INFO[order];
            const isAccessControl = workType === "access-control";
            return (
                <WorkBox
                    onClick={() => {
                        const updatedExchangeWorkInfo = getExchangeWorkInfo(
                            exchangeWorkInfo,
                            {
                                workName: workAgent,
                                workTime: workHour,
                                workOrder,
                                date,
                                day,
                            }
                        );
                        const isInvalidateExchange =
                            workSheet.includes(
                                updatedExchangeWorkInfo.start?.workName ?? "EMPTY"
                            ) && date !== updatedExchangeWorkInfo.start?.date;
                        if (isInvalidateExchange) return;

                        setExchangeWorkInfo(updatedExchangeWorkInfo);
                    }}
                    display="flex"
                    align="center"
                    justify="center"
                    flexDirection="column"
                    gap=".35rem"
                    width="100%"
                    pb={8}
                    pt={8}
                    pl={4}
                    pr={4}
                    borderRadius="bsm"
                    shadow="shadowXxsm"
                    hover_shadow="shadowLg"
                    background={
                        (exchangeWorkInfo &&
                            exchangeWorkInfo.end?.workName === workAgent &&
                            exchangeWorkInfo.end.date === date &&
                            exchangeWorkInfo.end.workOrder === order) ||
                        (exchangeWorkInfo &&
                            exchangeWorkInfo.start?.workName === workAgent &&
                            exchangeWorkInfo.start.date === date &&
                            exchangeWorkInfo.start.workOrder === order)
                            ? `${borderColor}`
                            : "white"
                    }
                    border={{
                        width: 1,
                        color: isAccessControl ? "white" : "white",
                        hover_color: borderColor,
                    }}
                    cursorPointer
                    key={`${workOrder}-${workHour}-${order}`}
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
                        <Badge size="sm" variant="light" color={color}>
                            <Text weight="bold" size="xs">
                                {isAccessControl ? "출입관리" : "셔틀버스"}{" "}
                                {workHour}
                            </Text>
                        </Badge>

                        {typeof time === "string" ? (
                            <Badge size="sm" variant="dot" color={color}>
                                <Text weight="bold" size="xs">
                                    {time}
                                </Text>
                            </Badge>
                        ) : (
                            time.map((time) => (
                                <Badge
                                    key={time}
                                    size="sm"
                                    variant="dot"
                                    color={color}
                                >
                                    <Text weight="bold" size="xs">
                                        {time}
                                    </Text>
                                </Badge>
                            ))
                        )}
                    </Box>
                </WorkBox>
            );
        })}
    </Box>
);

export default WorkSheet;
