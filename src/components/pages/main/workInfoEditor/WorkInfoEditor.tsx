import pallete from "../../../../styles/utils/pallete";
import { Check, Confetti, Settings, Trash } from "tabler-icons-react";

import { useEffect, useState } from "react";

import { Box } from "../../../atoms/container";

import { Button, Modal, NumberInput, Popover, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import "dayjs/locale/ko";

import {
    addDayToString,
    getWorkCycleInfo,
    isHolliday,
    WorkInfoType,
} from "../../../../utils/date";

import WorkSheet from "../../../workSheet";
import { WORK_INFO } from "../../../../constants/workInfo";

interface SlectDateProps {
    agentList: string[];
}

const validateDate = (date: Date) =>
    isHolliday(date) ? new Date(addDayToString(date, 2)) : date;

function WorkInfoEditor({ agentList }: SlectDateProps) {
    const [workInfoArray, setWorkInfoArray] = useLocalStorage<
        WorkInfoType<string>[]
    >({
        key: "WORK_INFO",
        defaultValue: [],
    });

    const [openCalendar, setOpenCalander] = useState(false);
    const [openeReset, setOpenReset] = useState(false);

    const [cycle, setCycle] = useState(1);

    const [workStartDate, setWorkStartDate] = useState<Date | null>(
        workInfoArray.length !== 0
            ? new Date(
                  addDayToString(
                      new Date(workInfoArray[workInfoArray.length - 1]?.date),
                      1
                  )
              )
            : new Date()
    );

    useEffect(() => {
        setWorkStartDate(
            workInfoArray.length !== 0
                ? new Date(
                      addDayToString(
                          new Date(workInfoArray[workInfoArray.length - 1]?.date),
                          1
                      )
                  )
                : new Date()
        );
    }, [workInfoArray]);

    return (
        <>
            <Box display="flex" flexDirection="column" align="center" gap="2.25rem">
                <Box
                    display="flex"
                    flexDirection="row"
                    align="center"
                    gap="1rem"
                    mt={16}
                >
                    <Button
                        variant="outline"
                        color="teal"
                        size="xs"
                        onClick={() => setOpenCalander(true)}
                        rightIcon={<Check color="teal" size={14} />}
                    >
                        새로운 업무 일정 만들기
                    </Button>
                    {workInfoArray.length !== 0 && (
                        <Popover
                            opened={openeReset}
                            onClose={() => setOpenReset(false)}
                            target={
                                <Button
                                    variant="outline"
                                    color="red"
                                    size="xs"
                                    onClick={() => setOpenReset(true)}
                                    rightIcon={<Trash color="red" size={14} />}
                                >
                                    업무 일정 파기하기
                                </Button>
                            }
                            width={240}
                            position="bottom"
                            withArrow
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                align="center"
                                justify="center"
                                width="100%"
                                gap="1rem"
                            >
                                <Text color="red" weight="bolder" size="sm">
                                    삭제된 일정은 복구가 불가능 합니다
                                </Text>
                                <Button
                                    variant="filled"
                                    color="red"
                                    size="xs"
                                    onClick={() => {
                                        setWorkInfoArray([]);
                                        setOpenReset(false);
                                    }}
                                    rightIcon={<Trash color="white" size={14} />}
                                >
                                    그럼에도 파기
                                </Button>
                            </Box>
                        </Popover>
                    )}
                </Box>

                <WorkSheet
                    workInfoArray={workInfoArray}
                    setWorkInfoArray={setWorkInfoArray}
                />
            </Box>

            <Modal
                opened={openCalendar}
                onClose={() => setOpenCalander(false)}
                centered
                overlayOpacity={0.5}
                overlayColor={pallete.gray3}
                withCloseButton={false}
                padding="lg"
                size={400}
                title={<Settings size={20} />}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    align="center"
                    justify="center"
                    gap="2.75rem"
                    width="100%"
                    minHeight={100}
                    pb={30}
                >
                    <DatePicker
                        placeholder="클릭해서 날짜 선택"
                        label="근무 시작일"
                        locale="ko"
                        value={workStartDate}
                        onChange={(date) => {
                            setWorkStartDate(validateDate(date!));
                        }}
                        firstDayOfWeek="sunday"
                        dayStyle={(date, modifiers) => {
                            if (modifiers.selected) {
                                return {
                                    background: pallete.teal7,
                                    border: `2px solid ${pallete.teal3}`,
                                    pointerEvents: "none",
                                };
                            }
                            return {};
                        }}
                        required
                    />
                    <NumberInput
                        defaultValue={1}
                        placeholder="방향키로 조작"
                        label="싸이클 숫자 정하기"
                        required
                        value={cycle}
                        onChange={(cycle) => setCycle(cycle!)}
                        min={1}
                    />

                    <Button
                        variant="filled"
                        color="teal"
                        rightIcon={<Confetti size={18} />}
                        onClick={() => {
                            setWorkInfoArray(
                                getWorkCycleInfo({
                                    startDate: workStartDate!,
                                    workPerDay: WORK_INFO.WORK_PER_DAY,
                                    workerList: agentList,
                                    cycle,
                                })
                            );
                            setOpenCalander(false);
                        }}
                    >
                        새로운 근무일지 생성
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default WorkInfoEditor;
