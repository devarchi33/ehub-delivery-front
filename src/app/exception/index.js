export const eHubException = (msg, location = "somewhere...") => {
    return {
        name: "eHub Exception!",
        message: msg + ", ===> " + location
    }
};