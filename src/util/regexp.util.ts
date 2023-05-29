const regexCache: { [key: string]: RegExp } = {};

export function getRegExp(url: string): RegExp {
  if (!regexCache[url]) {
    regexCache[url] = new RegExp(`^${url}/?(\\d*)$`, "i");
  }
  return regexCache[url];
}
