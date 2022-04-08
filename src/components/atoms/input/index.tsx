import { Input } from "@mantine/core";
import React, { useEffect, useRef } from "react";

interface UserInputProps {
    icon?: React.ReactNode;
    placeholder: string;
    rightSection?: React.ReactNode;
    rightSectionWidth?: number;
    setInput(input: string): void;
    initialFocus?: boolean;
    submitFunction?: () => void;
}

function UserInput({
    icon,
    placeholder,
    rightSection,
    rightSectionWidth,
    setInput,
    submitFunction,
    initialFocus = false,
}: UserInputProps) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        initialFocus && ref.current?.focus();
    }, []);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                typeof ref.current?.value === "string" &&
                    setInput(ref.current?.value);
                submitFunction && submitFunction();
            }}
        >
            <Input
                icon={icon}
                placeholder={placeholder}
                rightSectionWidth={rightSectionWidth ?? 75}
                rightSection={rightSection}
                styles={{ rightSection: { pointerEvents: "none" } }}
                ref={ref}
                variant="default"
                size="md"
            />
        </form>
    );
}

export default UserInput;
