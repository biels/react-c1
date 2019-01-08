import moment from "moment";

let format = 'DD/MM/YYYY';
export const parseDate = raw => moment(raw, format).toDate()
export const formatDate = date => moment(date).format(format)
