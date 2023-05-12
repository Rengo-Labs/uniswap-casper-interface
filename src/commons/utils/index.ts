import BigNumber from "bignumber.js";
import { Logger } from "./log";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const log = new Logger();

export const ONE_BILLION_E = 9;

export const convertBigNumberToUIString = (
  amount: BigNumber,
  decimals = 9
): string => amount.div(10 ** decimals).toString();
export const convertUIStringToBigNumber = (
  amount: BigNumber.Value,
  decimals = 9
): BigNumber => new BigNumber(amount).times(10 ** decimals);
export const convertAllFormatsToUIFixedString = (
  amount: BigNumber.Value,
  fixed = 6
): string => new BigNumber(amount).toFixed(fixed);

/**
 *
 * @param ms
 * @returns
 */
export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatNaN = (value: string | number) => {
  const parsedValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(parsedValue) ? 0 : parsedValue;
};

export const shortenString = (value: string, start: number, end?: number) => {
  const defaultEnd = end || start;
  const shortString = `${value.substring(0, start)}.....${value.substring(
    value.length - defaultEnd
  )}`;

  return shortString;
};

export const dateConverter = (date: string) => {
  const dateValue = dayjs(date);
  const now = dayjs();
  return dateValue.from(now);
};

export { createRecipientAddress } from "./keys";
