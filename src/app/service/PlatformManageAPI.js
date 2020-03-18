import {config} from "../config/config";

const BASE_URL = config.serverInfo;

export default class PlatformManageAPI {
    static findAllTpPlantEhubPlantMapping = () => {
        const options = {
            method: "GET",
        };

        return fetch(`${BASE_URL}/tp-ehub-plant-mapping/queryAllPlantMapping`, options)
        .then(res => res.json());
    };
}