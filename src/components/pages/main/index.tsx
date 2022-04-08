import styled from "styled-components";
import media from "../../../styles/utils/media";

import { Calendar, UserSearch } from "tabler-icons-react";

import { Tabs } from "@mantine/core";

import { Box } from "../../atoms/container";

import AgentList from "./agentList/AgentList";
import WorkInfoEditor from "./workInfoEditor/WorkInfoEditor";

const MainContainer = styled(Box)`
    left: 20%;
    ${media.mediumTablet} {
        left: 10%;
    }
`;

export interface AgentListProp {
    agentList: string[];
}

function MainTabPage({ agentList }: AgentListProp) {
    return (
        <MainContainer
            position="fixed"
            top={32}
            height="100%"
            minHeight="100vh"
            display="flex"
            flexDirection="row"
            align="flex-start"
            justify="center"
        >
            <Tabs variant="pills">
                <Tabs.Tab label="근무일지" icon={<Calendar size={16} />}>
                    <WorkInfoEditor agentList={agentList} />
                </Tabs.Tab>
                <Tabs.Tab label="요원 목록" icon={<UserSearch size={16} />}>
                    <AgentList agentList={agentList} />
                </Tabs.Tab>
            </Tabs>
        </MainContainer>
    );
}

export default MainTabPage;
