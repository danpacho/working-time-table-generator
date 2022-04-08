import { useLocalStorage } from "@mantine/hooks";

import { AGENT_LIST_KEY } from "./constants/localStorageKey";

import AgentPage from "./components/pages/agent";
import MainTabPage from "./components/pages/main";

function App() {
    const [agentList, setAgentList] = useLocalStorage<string[]>({
        key: AGENT_LIST_KEY,
        defaultValue: [],
    });

    return (
        <>
            <MainTabPage agentList={agentList} />
            <AgentPage agentList={agentList} setAgentList={setAgentList} />
        </>
    );
}

export default App;
