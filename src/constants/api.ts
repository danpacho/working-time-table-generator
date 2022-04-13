const API_URL = "/api/getRestDeInfo";

export interface API_PARAM_CONFIG {
    solYear?: number;
    solMonth?: number;
    ServiceKey: string;
    _type: "json" | "xml";
    numOfRows: number;
}

export interface API_RESPONSE {
    response: {
        body: {
            items: {
                item: {
                    locdate: number;
                    seq: number;
                    dateKind: number;
                    isHolliday: "Y";
                    dateName: string;
                }[];
            };
        };
    };
}

export { API_URL };
