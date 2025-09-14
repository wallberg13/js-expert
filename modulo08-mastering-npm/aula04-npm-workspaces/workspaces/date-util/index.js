import StringUtil from "@wallberg13/string-util";

const availableFormats = {
  "dd/mm/yyyy": "$<day>/$<month>/$<year>",
  "dd-mm-yyyy": "$<day>-$<month>-$<year>",
  "yyyy-mm-dd": "$<year>-$<month>-$<day>",
  "yyyy/mm/dd": "$<year>/$<month>/$<day>",
};

const yymmdd = /(?<year>\d{4}).(?<month>\d{2}).(?<day>\d{2})/g;
const ddmmyy = /(?<day>\d{2}).(?<month>\d{2}).(?<year>\d{4})/g;

const stringToDateExps = {
  "dd-mm-yyyy": ddmmyy,
  "dd/mm/yyyy": ddmmyy,
  "yyyy-mm-dd": yymmdd,
  "yyyy/mm/dd": yymmdd,
};

export default class DateUtil {
  static formatDate(date, format) {
    if (!Object.keys(availableFormats).includes(format)) {
      return { error: `the format ${format} is not available yer :(` };
    }

    const exp = availableFormats[format];
    // 1990-03-01T03:00:00.000Z => 1990-03-01 (o match ignora a hora)
    const [result] = date.toISOString().match(yymmdd);

    // 1990-03-01 => 01-03-1990 => To Format
    return result.replace(yymmdd, exp);
  }

  static formatString(dateStr, currentFormat, expectedFormat) {
    if (StringUtil.isEmpty(dateStr)) {
      return { error: "your text is empty" };
    }

    if (!Object.keys(availableFormats).includes(currentFormat)) {
      return { error: `the format ${currentFormat} is not available yet :(` };
    }

    if (!Object.keys(availableFormats).includes(expectedFormat)) {
      return { error: `the format ${expectedFormat} is not available yet :(` };
    }

    const toDateExp = stringToDateExps[currentFormat];
    const dateStrFormatted = StringUtil.removeEmptySpaces(dateStr).replace(
      toDateExp,
      "$<year>-$<month>-$<day>"
    );
    const date = new Date(dateStrFormatted);

    return this.formatDate(date, expectedFormat);
  }
}
