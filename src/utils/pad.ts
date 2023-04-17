export const padleft = (str: string, len: number, char: string): string => {
  return str.length >= len ? str : padleft(char + str, len, char)
}
