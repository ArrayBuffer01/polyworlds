export function getMainDomain(hostName: string) {
  const split = hostName.split(".");
  const mainDomain = split.slice(-2).join(".");
  return mainDomain;
}