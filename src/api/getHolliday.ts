import { API_PARAM_CONFIG, API_RESPONSE, API_URL } from "@constants/api";

import { axiosGET } from "@api/axios";

import { dateEqualizer, numToDate } from "@core/work-gen";

const getNationalHolliday = async (
    APIparams: Omit<API_PARAM_CONFIG, "ServiceKey">
) => {
    const { data } = await axiosGET<API_RESPONSE>({
        url: API_URL,
        params: {
            ServiceKey: import.meta.env.VITE_API_KEY,
            ...APIparams,
        } as API_PARAM_CONFIG,
    });
    return data;
};

const getCurrentNationalHolliday = async () =>
    await getNationalHolliday({
        _type: "json",
        numOfRows: 30,
        solYear: 2023,
    });

const getCurrentNationalHollidayStringArray = async () =>
    await (
        await getCurrentNationalHolliday()
    ).response.body.items.item.map(({ locdate }) =>
        dateEqualizer(numToDate(locdate))
    );
