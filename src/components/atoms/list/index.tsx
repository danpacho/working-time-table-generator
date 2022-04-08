import { Text } from "@mantine/core";
import { ReactNode } from "react";
import { Box } from "../container";

interface ListProps {
    listElement: string | ReactNode;
}
function List({ listElement }: ListProps) {
    return (
        <Box
            display="flex"
            align="center"
            justify="space-evenly"
            maxWidth={125}
            minWidth={100}
            pt=".5rem"
            pb=".5rem"
            pr="1rem"
            pl=".5rem"
            border={{
                color: "gray1",
                width: 1.25,
                hover_color: "white",
            }}
            background="white"
            hover_background="gray1"
            gap={"1rem"}
        >
            {typeof listElement === "string" && <Text>{listElement}</Text>}
            {typeof listElement !== "string" && listElement}
        </Box>
    );
}

export default List;
