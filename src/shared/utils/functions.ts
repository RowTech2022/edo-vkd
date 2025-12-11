export const toISOString = (date?: Date) => {
  if (!date) return "";
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(date.getTime() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime;
};

export const sliceEnd = (str: string, endChrCnt: number) => {
  return str.slice(0, str.length - endChrCnt);
};

export function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
