export type ZIndexes = typeof zIndexes;
export type ZIndexesType = keyof ZIndexes;

const zIndexes = {
    zBackground: -10,
    zContnet: 10,
    zBlurBackground: 50,
    zModalBackground: 100,
    zModal: 200,
    zToolTip: 500,
};

export default zIndexes;
