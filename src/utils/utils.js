export function convertObjToStr(a) {
    return (a && typeof a !== "string" && Object.keys(a).reduce((p, c) => p + a[c], "")) || a;
}

export function unicodeUnEscape(string) {
    return string.replace(/%u([\dA-Z]{4})|%([\dA-Z]{2})/g, function(_, m1, m2) {
      return String.fromCharCode(parseInt("0x" + (m1 || m2)));
    })
  }