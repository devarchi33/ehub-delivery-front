import { describe, it } from 'mocha';
import chai from "chai"
import { addItem, removeMultiItems, findValueFromList } from "../util/listHelper";

const expect = chai.expect;
const assert = chai.assert;

// @See http://chaijs.com/api/assert
describe("listHelper", function() {
    describe("addItemToList", function() {
        it("addItemToList result", function() {
            const result = addItem([], "new Item");
            const expected = ["new Item"];
            assert.deepEqual(result, expected);
        });
    });
    describe("removeMultiItems", function() {
        it("removeMultiItems result", function() {
            const originalList = [ { key: "aa" }, { key: "bb" }, { key: "cc" }, { key: "dd" }, { key: "ee" }, { key: "ff" } ];
            const removeItemList = [ { key: "aa" }, { key: "bb" }, { key: "cc" }, { key: "dd" } ];
            const result = removeMultiItems(originalList, removeItemList);
            const expected = [ { key: "ee" }, { key: "ff" } ];
            assert.deepEqual(result, expected);
        });
    });
    describe("findValueFromList", function() {
        it("findValueFromList result", function() {
            const targetList = [ "aa", "bb" ];
            const searchKeyword = "a";
            const result = findValueFromList(targetList, searchKeyword);
            const expected = [ "aa" ];
            assert.deepEqual(result, expected);
        });
    });
});