import { useState } from "react";
import { Button, Badge, Text, Tooltip } from "@mantine/core";

import { Trash, UserCircle } from "tabler-icons-react";

import { Box, UserInput } from "@components/atoms";

import { CRUDAgentProps } from ".";

const agentUpdator = {
    add: (agentList: string[], agentName: string) => {
        if (agentList.includes(agentName) || agentName === "") return agentList;
        return [...agentList, agentName];
    },
    remove: (agentList: string[], agentName: string) =>
        agentList.filter((agent) => agent !== agentName),
};

function AgentUpdate({ agentList, setAgentList }: CRUDAgentProps) {
    const [agentName, setAgentName] = useState("");

    const agentSubmitHandler = () => {
        setAgentList((agentList) => agentUpdator.add(agentList, agentName));
        setAgentName("");
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            align="center"
            justify="flex-start"
            mt={30}
            pt="0"
            pb="1.5rem"
            pr="1.5rem"
            pl="1.5rem"
            gap="2.5rem"
            maxHeight="30rem"
            overflowY="scroll"
            width="100%"
        >
            <Box
                position="sticky"
                top="0px"
                display="flex"
                align="center"
                justify="center"
                width="100%"
                zIndex="zModal"
            >
                <UserInput
                    placeholder="Enter키를 눌러 추가"
                    rightSection={
                        <Badge color="blue" variant="outline">
                            요원
                        </Badge>
                    }
                    input={agentName}
                    setInput={setAgentName}
                    submitHandler={agentSubmitHandler}
                    initialFocus
                    rightSectionWidth={60}
                />
            </Box>

            <Box
                display="flex"
                align="center"
                justify="center"
                flexDirection="column"
                gap="0.75rem"
                width="100%"
            >
                {agentList?.map((agent) => (
                    <Box
                        pAll={10}
                        display="flex"
                        align="center"
                        justify="space-between"
                        flexDirection="row"
                        gap="1rem"
                        fontSize="md"
                        width="100%"
                        shadow="shadowXxsm"
                        borderRadius="bxxsm"
                        key={agent}
                    >
                        <Box
                            display="flex"
                            align="center"
                            justify="center"
                            gap="1rem"
                        >
                            <UserCircle strokeWidth={1.5} size={24} />
                            <Text color="dark" weight="bolder" size="md">
                                {agent}
                            </Text>
                        </Box>
                        <Tooltip label="복구 불가능" withArrow position="right">
                            <Button
                                variant="outline"
                                rightIcon={<Trash size={14} />}
                                size="xs"
                                radius="sm"
                                onClick={() => {
                                    setAgentList((agentList) =>
                                        agentUpdator.remove(agentList, agent)
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
        </Box>
    );
}

export default AgentUpdate;
