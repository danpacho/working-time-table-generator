import { Avatar, Text } from "@mantine/core";
import { User } from "tabler-icons-react";
import { AgentListProp } from "..";
import { Box } from "../../../atoms/container";
import List from "../../../atoms/list";

function AgentList({ agentList }: AgentListProp) {
    const sortedAgentList = agentList.sort();

    return (
        <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            align="center"
            justify="flex-start"
            gap="1rem"
            width="85%"
            mt={18}
        >
            {sortedAgentList.map((agent) => (
                <List
                    listElement={
                        <>
                            <Avatar color="teal" radius="sm">
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
    );
}

export default AgentList;
