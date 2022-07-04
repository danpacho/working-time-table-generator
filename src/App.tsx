import styled from "styled-components";

import { useLocalStorage } from "@mantine/hooks";

import { AGENT_LIST_KEY } from "@constants/localStorageKey";

import TabPage from "./pages/tabs";

const MainContainer = styled.main`
    min-width: 100vw;
    width: 100%;

    min-height: 100vh;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
`;

function App() {
    const [agentList, setAgentList] = useLocalStorage<string[]>({
        key: AGENT_LIST_KEY,
        defaultValue: [],
    });

    return (
        <MainContainer>
            <TabPage agentList={agentList} setAgentList={setAgentList} />
        </MainContainer>
    );
}

export default App;
