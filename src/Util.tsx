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
}
