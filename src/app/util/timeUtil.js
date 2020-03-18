export const getSystemTimezoneDate = () => {
    // sample: 2017-11-10_09:04:14
    return window.moment().format().slice(0, 19).replace("T", "_");
};

export const getTime_YYYYMMDDHHmmss = () => {
    return window.moment().format('YYYYMMDDHHmmss');
};

export const getTime_YYYYMMDD_HHmmss = () => {
    return formatDate(new Date(), 'YYYYMMDD_HHmmss');
};

// export const parseDateUtcToCst = (time, format) => window.moment(time, 'YYYYMMDDHHmmss').add(8, 'hours').format(format);
export const formatDate = (time, format) => window.moment(time, 'YYYYMMDDHHmmss').format(format);