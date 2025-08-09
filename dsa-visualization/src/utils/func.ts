export function isNumber(input: string): boolean {
  const len = input.length;
    for (let i = 0; i < len; i++) {
      if (i === 0 && input[i] === "-") continue;
      if (input[i] < "0" || input[i] > "9") return false;
    }
    return true;
};