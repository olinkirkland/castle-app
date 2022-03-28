export default class Util {
  public static numberToAdj(n: number): string {
    // 4 -> 4th, 23 -> 23rd
    // n should always be an integer
    if (!Number.isInteger(+n)) return `${n}`;

    const lastDigit: number = n % 10;

    let ending: string = 'th';

    if (lastDigit >= 1 && lastDigit <= 3 && Math.floor(n / 10) !== 1)
      ending = ['st', 'nd', 'rd'][lastDigit - 1];

    return n + ending;
  }

  // Capitalize first letter
  static capitalize(str: string): string {
    if (!str) return str;

    const arr: string[] = str.split(' ');
    str = arr.reduce(
      (accumulator, s) =>
        accumulator + ' ' + s.charAt(0).toUpperCase() + s.substring(1),
      ''
    );

    return str.trim();
  }

  public static download(name: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', name);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
