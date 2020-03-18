import console from '../util/logger';

export const addItem = (list, item) => [...list, item];

export const removeMultiItems = (originalList, removeItemList) => {
    let removeIdxList = [];
    removeItemList.forEach(removeItem => {
        removeIdxList = removeIdxList.concat(originalList.findIndex(item => item.key === removeItem.key));
    });

    console.log("listHelper removeMultiItems >>>>>>>>>>>> ", removeIdxList);
    return originalList.filter((value, index) => {
        return removeIdxList.indexOf(index) === -1;
    })
};

export const findValueFromList = (targetList, searchKeyword) => {
    return targetList.filter(targetValue => {
        return targetValue.match(searchKeyword);
    });
};