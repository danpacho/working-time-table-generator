import { Input } from "@mantine/core";
import React, { useEffect, useRef } from "react";

interface UserInputProps {
    icon?: React.ReactNode;
    placeholder: string;
    rightSection?: React.ReactNode;
    rightSectionWidth?: number;
    setInput(input: string): void;
    input: string;
    initialFocus?: boolean;
    submitHandler: () => void;
}

function UserInput({
    icon,
    placeholder,
    rightSection,
    rightSectionWidth,
    setInput,
    input,
    initialFocus = false,
    submitHandler,
}: UserInputProps) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        initialFocus && ref.current?.focus();
    }, []);

    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setInput(e.target.value);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submitHandler();
            }}
        >
            <Input
                value={input}
                icon={icon}
                placeholder={placeholder}
                rightSectionWidth={rightSectionWidth ?? 75}
                rightSection={rightSection}
                styles={{ rightSection: { pointerEvents: "none" } }}
                ref={ref}
                variant="default"
                size="md"
                onChange={onChange}
            />
        </form>
    );
}

export default UserInput;
