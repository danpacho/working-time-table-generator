export interface CRUDAgentProps {
    agentList: string[];
    setAgentList: (val: string[] | ((prevState: string[]) => string[])) => void;
}

export { default as AgentUpdate } from "./agent-update";
