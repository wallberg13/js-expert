import { deepStrictEqual } from "assert";
import DateUtil from "./index.js";

/// FormatDate
{
  const format = "dd-M-Y";

  const expected = { error: `the format ${format} is not available yer :(` };
  const date = new Date(1990, 2, 1);
  const result = DateUtil.formatDate(date, format);

  deepStrictEqual(result, expected);
}

{
  const expected = "01-12-1990";
  const format = "dd-mm-yyyy";
  const date = new Date("1990-12-01");
  const result = DateUtil.formatDate(date, format);
  deepStrictEqual(result, expected);
}

{
  const expected = "22/06/1995";
  const format = "dd/mm/yyyy";
  const date = new Date("1995-06-22");
  const result = DateUtil.formatDate(date, format);
  deepStrictEqual(result, expected);
}

{
  const expected = "1995-06-22";
  const format = "yyyy-mm-dd";
  const date = new Date("1995-06-22");
  const result = DateUtil.formatDate(date, format);
  deepStrictEqual(result, expected);
}

/// FormatString

{
  const expected = { error: "your text is empty" };
  const date = "";
  const result = DateUtil.formatString(date);
  deepStrictEqual(result, expected);
}

{
  const data = {
    value: "1990-april-01",
    format: "yyy-M-dd",
  };
  const expected = {
    error: `the format ${data.format} is not available yet :(`,
  };
  const result = DateUtil.formatString(data.value, data.format);
  deepStrictEqual(result, expected);
}

{
  const data = {
    value: "1990-01-01",
    format: "yyyy-mm-dd",
  };
  const expectedFormat = "dd/M/yyyy";

  const expected = {
    error: `the format ${expectedFormat} is not available yet :(`,
  };
  const result = DateUtil.formatString(data.value, data.format, expectedFormat);
  deepStrictEqual(result, expected);
}

{
  const data = {
    value: "1990-01-01",
    format: "yyyy-mm-dd",
  };
  const expectedFormat = "dd-mm-yyyy";
  const expected = "01-01-1990";
  const result = DateUtil.formatString(data.value, data.format, expectedFormat);
  deepStrictEqual(result, expected);
}

{
  const data = {
    value: " 1 9 9 0 / 0 7 / 0 1 ",
    format: "yyyy/mm/dd",
  };
  const expectedFormat = "dd/mm/yyyy";
  const expected = "01/07/1990";
  const result = DateUtil.formatString(data.value, data.format, expectedFormat);
  deepStrictEqual(result, expected);
}

{
  const data = {
    value: " 1 9 9 0 / 0 7 / 0 1 ",
    format: "yyyy/mm/dd",
  };
  const expectedFormat = "yyyy-mm-dd";
  const expected = "1990-07-01";
  const result = DateUtil.formatString(data.value, data.format, expectedFormat);
  deepStrictEqual(result, expected);
}

{
  const data = {
    value: " 0 1 / 0 4/ 1 9 9 0 ",
    format: "dd/mm/yyyy",
  };
  const expectedFormat = "yyyy-mm-dd";
  const expected = "1990-04-01";
  const result = DateUtil.formatString(data.value, data.format, expectedFormat);
  deepStrictEqual(result, expected);
}
