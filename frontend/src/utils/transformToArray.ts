export function transformToArray(params: string) {
  const value = params as string;

  if (typeof value === "string") {
    return value.split(",").map(String);
  }

  return value;
}
