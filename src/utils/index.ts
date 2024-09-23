export function padZero (number: number, length: number): string {
  const str = number.toString();
  const test = length - str.length;
  let zero = '';

  for(let i = 0; i < test; i++) {
    zero += '0';
  }

  return `${zero}${number}`;
}