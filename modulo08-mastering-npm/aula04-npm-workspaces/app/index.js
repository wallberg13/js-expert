import DateUtil from "@wallberg13/date-util";

console.log(DateUtil.formatString("01/04/1990", "dd/mm/yyyy", "yyyy-mm-dd"));
console.log(DateUtil.formatDate(new Date(), "dd/mm/yyyy"));
