import pallete from "../../../styles/utils/pallete";
import { useState } from "react";

import { Button, Modal } from "@mantine/core";

import { Edit, Users } from "tabler-icons-react";

import AgentUpdate from "./agent-update";

export interface CRUDAgentProps {
    agentList: string[];
    setAgentList: (val: string[] | ((prevState: string[]) => string[])) => void;
}

function AgentPage({ agentList, setAgentList }: CRUDAgentProps) {
    const [crudAgentOpened, setCrudAgentOpenend] = useState(false);

    return (
        <>
            <Button
                onClick={() => setCrudAgentOpenend(true)}
                style={{
                    position: "absolute",
                    top: "2rem",
                    right: "4rem",
                }}
                variant="outline"
                color="teal"
                size="xs"
                leftIcon={<Users size={16} />}
            >
                요원 수정
            </Button>

            <Modal
                title={<Edit size={24} strokeWidth={2} color={"black"} />}
                opened={crudAgentOpened}
                onClose={() => setCrudAgentOpenend(false)}
                centered
                overlayOpacity={0.65}
                overlayColor={pallete.gray3}
                withCloseButton={false}
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <AgentUpdate agentList={agentList} setAgentList={setAgentList} />
            </Modal>
        </>
    );
}

export default AgentPage;
