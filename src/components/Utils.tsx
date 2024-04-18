import { Option } from "mendix";

export const formatDate = (inputDate: Date | Option<Date>): string => {
    if (inputDate === undefined) {
        inputDate = new Date();
    }
    let month = (inputDate.getMonth() + 1).toString();
    month = month.length === 1 ? "0" + month : month;
    let date = inputDate.getDate().toString();
    date = date.length === 1 ? "0" + date : date;
    return inputDate.getFullYear() + "-" + month + "-" + date;
};