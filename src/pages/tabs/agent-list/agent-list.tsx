import { Avatar, Text } from "@mantine/core";
import { User } from "tabler-icons-react";
import { AgentListProp } from "..";

import { Box } from "../../../components/atoms";
import { List } from "../../../components/molecules";

function AgentList({ agentList }: AgentListProp) {
    const sortedAgentList = agentList.sort();

    return (
        <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            width="100%"
            align="center"
            justify="center"
            gap="1rem"
            mt={18}
        >
            <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                width="65%"
                align="center"
                justify="center"
                gap="2rem"
                mt={18}
            >
                {sortedAgentList.map((agent) => (
                    <List
                        listElement={
                            <>
                                <Avatar color="teal" radius="md">
                                    <User size={20} />
                                </Avatar>
                                <Text weight="bolder" size="sm">
                                    {agent}
                                </Text>
                            </>
                        }
                        key={agent}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default AgentList;
