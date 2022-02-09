export function convertObjToStr(a) {
  return (a && typeof a !== "string" && Object.keys(a).reduce((p, c) => p + a[c], "")) || a;
}

export function unicodeUnEscape(string) {
  return string.replace(/%u([\dA-Z]{4})|%([\dA-Z]{2})/g, function (_, m1, m2) {
    return String.fromCharCode(parseInt("0x" + (m1 || m2)));
  })
}

export function swapItems(arr, a, b) {
  arr[a] = arr.splice(b, 1, arr[a])[0];
  return arr;
}

export function listToMatrix(list, elementsPerSubArray) {
  let matrix = [], i, k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}