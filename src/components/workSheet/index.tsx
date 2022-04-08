import styled from "styled-components";
import media from "../../styles/utils/media";
import animation from "../../styles/utils/animation";

import { Exchange, Trash } from "tabler-icons-react";

import { useState } from "react";

import {
    ActionIcon,
    Badge,
    Button,
    Pagination,
    SimpleGrid,
    Text,
} from "@mantine/core";

import { WorkInfoType } from "../../utils/date";

import { Box } from "../atoms/container";
import { DAY_WORK_INFO } from "../../constants/dayWorkInfo";

interface WorkSheetProps {
    setWorkInfoArray: (
        val:
            | WorkInfoType<string>[]
            | ((prevState: WorkInfoType<string>[]) => WorkInfoType<string>[])
    ) => void;
    workInfoArray: WorkInfoType<string>[];
}
const CONTENT_PER_PAGE = 5;

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
    const modified = [...workInfoArray];
    modified[exchangeStartIndex].workSheet[exchangeWorkInfo.start.workIndex] =
        exchangeWorkInfo.end.workName;
    modified[exchangeEndIndex].workSheet[exchangeWorkInfo.end.workIndex] =
        exchangeWorkInfo.start.workName;

    return modified;
};

const ExchangeWorkContainer = styled(Box)`
    right: 8rem;
    ${media.mediumTablet} {
        right: 2rem;
    }

    animation: ${animation.popInFromBottom} 0.5s
        cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;
function WorkSheet({ workInfoArray, setWorkInfoArray }: WorkSheetProps) {
    const [activePage, setPage] = useState(1);
    const [exchangeWorkInfo, setExchangeWorkInfo] =
        useState<ExchangeWorkInfo | null>(null);

    return (
        <>
            <SimpleGrid cols={5} spacing="md">
                {workInfoArray
                    ?.slice(
                        (activePage - 1) * CONTENT_PER_PAGE,
                        activePage * CONTENT_PER_PAGE
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

            <Pagination
                total={parseInt(String(workInfoArray.length / CONTENT_PER_PAGE)) + 1}
                page={activePage}
                onChange={setPage}
                color="teal"
                size="sm"
                radius="sm"
                withEdges
                boundaries={3}
                initialPage={1}
            />
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
                    shadow="shadowMd"
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
                            gap=".25rem"
                        >
                            <Text size="xs" weight="bold">
                                {exchangeWorkInfo.start.workName}
                            </Text>
                            <Badge size="xs" variant="outline" color="red">
                                {exchangeWorkInfo.start.date}{" "}
                                {exchangeWorkInfo.start.day}
                            </Badge>
                        </Box>
                        <ActionIcon variant="light" color="gray">
                            <Exchange size={14} />
                        </ActionIcon>

                        <Box
                            display="flex"
                            flexDirection="column"
                            align="center"
                            justify="center"
                            gap=".25rem"
                        >
                            <Text size="xs" weight="bold">
                                {exchangeWorkInfo.end.workName}
                            </Text>
                            <Badge size="xs" variant="outline" color="indigo">
                                {exchangeWorkInfo.end.date}{" "}
                                {exchangeWorkInfo.end.day}
                            </Badge>
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="row"
                        align="center"
                        justify="center"
                        gap="1.5rem"
                    >
                        <Button
                            size="xs"
                            variant="filled"
                            color="teal"
                            rightIcon={<Exchange size={14} />}
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
}: DayWorkSheetProps) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            align="center"
            justify="center"
            gap=".5rem"
        >
            <Box
                minWidth="max-content"
                background="gray1"
                color="gray9"
                fontWeight="600"
                borderRadius="bxxsm"
                display="flex"
                align="center"
                justify="center"
                fontSize="sm"
                pt={4}
                pb={4}
                pr={6}
                pl={6}
            >
                {date} {day}요일
            </Box>

            {workSheet.map((workAgent, order) => (
                <WorkBox
                    onClick={() => {
                        const info = getExchangeWorkInfo(exchangeWorkInfo, {
                            workName: workAgent,
                            workIndex: DAY_WORK_INFO[order].workIndex,
                            workTime: DAY_WORK_INFO[order].workHour,
                            date,
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
                    borderRadius="bmd"
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
                            ? `${DAY_WORK_INFO[order].borderColor}`
                            : "white"
                    }
                    border={{
                        width: 1.25,
                        color: "gray1",
                        hover_color: `${DAY_WORK_INFO[order].borderColor}`,
                    }}
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
                            variant="dot"
                            color={DAY_WORK_INFO[order].color}
                        >
                            <Text weight="bold" size="xs">
                                {DAY_WORK_INFO[order].time}
                            </Text>
                        </Badge>
                        <Badge
                            size="sm"
                            variant="light"
                            color={DAY_WORK_INFO[order].color}
                        >
                            <Text weight="bold" size="xs">
                                {DAY_WORK_INFO[order].workHour}
                            </Text>
                        </Badge>
                    </Box>
                </WorkBox>
            ))}
        </Box>
    );
};

export default WorkSheet;
