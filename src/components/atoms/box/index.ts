import styled, { css } from "styled-components";

import borderRadius, { BorderRadiusType } from "@styles/utils/borderRadius";
import fontSize, { FontSizeType } from "@styles/utils/font";
import pallet, { PalletType } from "@styles/utils/pallet";
import shadow, { ShadowType } from "@styles/utils/shadow";
import zIndexes, { ZIndexesType } from "@styles/utils/zIndex";

type PixelType = number | string;
type OverflowType = "scroll" | "hidden" | "visible" | "auto";
type WidthHeightType = "fit-content" | "max-content" | "min-content" | PixelType;

interface ContainerStyle {
    display?: "flex" | "grid" | "block" | "inline" | "none";
    flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
    flexWrap?: "no-wrap" | "wrap" | "wrap-reverse";
    align?: "center" | "flex-start" | "flex-end";
    justify?:
        | "center"
        | "flex-start"
        | "flex-end"
        | "space-between"
        | "space-evenly"
        | "space-around";
    gap?: PixelType;

    position?: "relative" | "absolute" | "fixed" | "sticky";
    top?: PixelType;
    bottom?: PixelType;
    left?: PixelType;
    right?: PixelType;

    width?: WidthHeightType;
    minWidth?: WidthHeightType;
    maxWidth?: WidthHeightType;

    height?: WidthHeightType;
    minHeight?: WidthHeightType;
    maxHeight?: WidthHeightType;

    pt?: PixelType;
    pb?: PixelType;
    pr?: PixelType;
    pl?: PixelType;
    pAll?: PixelType;

    mt?: PixelType;
    mb?: PixelType;
    mr?: PixelType;
    ml?: PixelType;
    mAll?: PixelType;

    borderRadius?: BorderRadiusType;

    border?: {
        width: PixelType;
        color: PalletType;
        hover_color?: PalletType;
    };

    background?: PalletType;
    hover_background?: PalletType;

    color?: PalletType;
    hover_color?: PalletType;
    fontSize?: FontSizeType;
    fontWeight?:
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900";

    shadow?: ShadowType;
    hover_shadow?: ShadowType;

    overflow?: OverflowType;
    overflowX?: OverflowType;
    overflowY?: OverflowType;

    zIndex?: ZIndexesType;

    cursorPointer?: boolean;
}
const containerStyle = {
    default: {
        background: pallet.white,
        borderRadius: borderRadius.bmd,
        borderColor: "transparent",
        hover_borderColor: "transparent",
        borderWidth: "1.25px",
        color: pallet.trueDeepDark,
        fontSize: fontSize.md,
    },
};

const transformPixel = (pixel: number | string) => {
    if (typeof pixel === "number") {
        return `${pixel}px`;
    }
    return pixel;
};

interface BoxModelProps {
    all?: PixelType;
    top?: PixelType;
    bottom?: PixelType;
    left?: PixelType;
    right?: PixelType;
    type: "padding" | "margin";
}
const getBoxModel = ({ all, top, bottom, right, left, type }: BoxModelProps) => {
    if (all) {
        const allBox = `${type}: ${transformPixel(all)};`;
        return css`
            ${allBox}
        `;
    }

    return css`
        ${type}-top: ${top ? transformPixel(top) : "unset"};
        ${type}-bottom: ${bottom ? transformPixel(bottom) : "unset"};
        ${type}-right: ${right ? transformPixel(right) : "unset"};
        ${type}-left: ${left ? transformPixel(left) : "unset"};
    `;
};

const Box = styled.div<ContainerStyle>`
    transition: all ease 0.25s;

    display: ${(p) => p.display ?? "unset"};
    flex-direction: ${(p) => p.flexDirection ?? "unset"};
    flex-wrap: ${(p) => p.flexWrap ?? "unset"};
    align-items: ${(p) => p.align ?? "unset"};
    justify-content: ${(p) => p.justify ?? "unset"};

    gap: ${(p) => (p.gap ? transformPixel(p.gap) : "unset")};

    position: ${(p) => p.position ?? "static"};
    ${(p) =>
        p?.top &&
        css`
            top: ${transformPixel(p.top)};
        `};
    ${(p) =>
        p?.bottom &&
        css`
            bottom: ${transformPixel(p.bottom)};
        `};
    ${(p) =>
        p?.right &&
        css`
            right: ${transformPixel(p.right)};
        `};
    ${(p) =>
        p?.left &&
        css`
            left: ${transformPixel(p.left)};
        `}

    width: ${(p) => (p.width ? transformPixel(p.width) : "fit-content")};
    min-width: ${(p) => (p.minWidth ? transformPixel(p.minWidth) : "unset")};
    max-width: ${(p) => (p.maxWidth ? transformPixel(p.maxWidth) : "unset")};

    height: ${(p) => (p.height ? transformPixel(p.height) : "fit-content")};
    min-height: ${(p) => (p.minHeight ? transformPixel(p.minHeight) : "unset")};
    max-height: ${(p) => (p.maxHeight ? transformPixel(p.maxHeight) : "unset")};

    background-color: ${(p) =>
        p.background ? pallet[p.background] : containerStyle.default.background};

    color: ${(p) => (p.color ? pallet[p.color] : containerStyle.default.color)};
    font-size: ${(p) =>
        p.fontSize ? fontSize[p.fontSize] : containerStyle.default.fontSize};
    font-weight: ${(p) => p.fontWeight ?? "unset"};

    ${({ pAll, pb, pl, pr, pt }) =>
        getBoxModel({
            type: "padding",
            all: pAll,
            top: pt,
            bottom: pb,
            right: pr,
            left: pl,
        })}

    ${({ mAll, mb, ml, mr, mt }) =>
        getBoxModel({
            type: "margin",
            all: mAll,
            top: mt,
            bottom: mb,
            right: mr,
            left: ml,
        })}

    border-radius: ${(p) =>
        p.borderRadius
            ? borderRadius[p.borderRadius]
            : containerStyle.default.borderRadius};

    border-style: solid;
    border-color: ${(p) =>
        p.border?.color
            ? pallet[p.border.color]
            : containerStyle.default.borderColor};
    border-width: ${(p) =>
        p.border?.width
            ? transformPixel(p.border.width)
            : containerStyle.default.borderWidth};

    box-shadow: ${(p) => (p.shadow ? shadow[p.shadow] : "unset")};

    user-select: none;

    overflow: ${(p) => p?.overflow};
    overflow-x: ${(p) => p?.overflowX};
    overflow-y: ${(p) => p?.overflowY};

    z-index: ${(p) => p.zIndex && zIndexes[p.zIndex]};

    cursor: ${(p) => (p.cursorPointer ? "pointer" : "auto")};

    &:hover {
        color: ${(p) => p.hover_color && pallet[p.hover_color]};

        border-color: ${(p) =>
            p.border?.hover_color
                ? pallet[p.border.hover_color]
                : containerStyle.default.hover_borderColor};
        background-color: ${(p) => p.hover_background && pallet[p.hover_background]};

        box-shadow: ${(p) => p.hover_shadow && shadow[p.hover_shadow]};
    }
`;

export default Box;
