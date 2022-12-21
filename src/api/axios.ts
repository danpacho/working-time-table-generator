import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const axiosGET = async <RequestDataType>(
    AxiosGETProps: Omit<AxiosRequestConfig, "method" | "data">
): Promise<AxiosResponse<RequestDataType>> => {
    try {
        const response: AxiosResponse<RequestDataType> = await axios({
            method: "get",
            ...AxiosGETProps,
        });

        return response;
    } catch (err) {
        throw new Error(
            `\n\n${err}\n\nGET method error occurred @: ${AxiosGETProps.url}`
        );
    }
};

export { axiosGET };
