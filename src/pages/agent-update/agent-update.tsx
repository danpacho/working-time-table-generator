import { useState } from "react";
import { Button, Badge, Text, Tooltip } from "@mantine/core";

import { Trash, UserCircle } from "tabler-icons-react";

import { Box, UserInput } from "@components/atoms";

import { CRUDAgentProps } from ".";

const updateAgentList = (agentList: string[], agentName: string) => {
    if (agentList.includes(agentName) || agentName === "") return agentList;
    return [...agentList, agentName];
};

const removeAgentList = (agentList: string[], agentName: string) =>
    agentList.filter((agent) => agent !== agentName);

function AgentUpdate({ agentList, setAgentList }: CRUDAgentProps) {
    const [agentName, setAgentName] = useState("");

    const agentSubmitHandler = () => {
        setAgentList((agentList) => updateAgentList(agentList, agentName));
        setAgentName("");
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            align="center"
            justify="flex-start"
            background="white"
            pt="0"
            pb="1.5rem"
            pr="1.5rem"
            pl="1.5rem"
            gap=".75rem"
            maxHeight="30rem"
            overflowY="scroll"
            width="100%"
        >
            <Box position="sticky" top={0} zIndex="zContnet">
                <UserInput
                    icon={<UserCircle size={24} strokeWidth={1.25} />}
                    placeholder="Enter키를 눌러 추가"
                    rightSection={
                        <Badge color="blue" variant="outline">
                            요원
                        </Badge>
                    }
                    setInput={setAgentName}
                    input={agentName}
                    submitHandler={agentSubmitHandler}
                    initialFocus
                    rightSectionWidth={65}
                />
            </Box>

            {agentList?.map((agent) => (
                <Box
                    pt={8}
                    pb={8}
                    pr={16}
                    pl={16}
                    display="flex"
                    align="center"
                    justify="space-between"
                    flexDirection="row"
                    key={agent}
                    fontSize="md"
                    gap="1rem"
                    minWidth={250}
                    shadow="shadowXxsm"
                    borderRadius="bxsm"
                >
                    <Text color="dark" weight={"bolder"} size="sm">
                        {agent}
                    </Text>
                    <Tooltip label="복구 불가능" withArrow position="right">
                        <Button
                            variant="outline"
                            rightIcon={<Trash size={14} />}
                            size="xs"
                            radius="sm"
                            onClick={() => {
                                setAgentList((agentList) =>
                                    removeAgentList(agentList, agent)
                                );
                            }}
                            color="red"
                        >
                            삭제
                        </Button>
                    </Tooltip>
                </Box>
            ))}
        </Box>
    );
}

export default AgentUpdate;
