import styled from "styled-components";
import media from "@styles/utils/media";

import { Calendar, Users } from "tabler-icons-react";

import { Tabs, Text } from "@mantine/core";

import { Box } from "@components/atoms";

import { CRUDAgentProps, AgentUpdate } from "./agent-update";
import { WorkTable } from "./work-table";

const MainContainer = styled(Box)`
    left: 20%;
    ${media.mediumTablet} {
        left: 10%;
    }
`;

function MainTabPage({ agentList, setAgentList }: CRUDAgentProps) {
    return (
        <MainContainer
            display="flex"
            width="100%"
            minWidth="100vw"
            height="100%"
            minHeight="100vh"
            flexDirection="row"
            align="flex-start"
            justify="center"
        >
            <Tabs
                variant="pills"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2rem",
                }}
            >
                <Tabs.Tab
                    label={
                        <Text size="sm" variant="text" weight="bold">
                            근무 일지
                        </Text>
                    }
                    icon={<Calendar size={18} />}
                >
                    <WorkTable agentList={agentList} />
                </Tabs.Tab>
                <Tabs.Tab
                    label={
                        <Text size="sm" variant="text" weight="bold">
                            요원 수정
                        </Text>
                    }
                    icon={<Users size={18} />}
                >
                    <AgentUpdate agentList={agentList} setAgentList={setAgentList} />
                </Tabs.Tab>
            </Tabs>
        </MainContainer>
    );
}

export default MainTabPage;
