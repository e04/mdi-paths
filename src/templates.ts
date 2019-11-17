import jsKeywords from "./keywords";

const allTemplate = (json: string) => {
  return `export default {${json}};`;
};

const eachTemplate = (name: string, path: string): string => {
  return `export const ${name} = '${path}';`;
};

export const indexTsTemplate = (paths: { [key: string]: string }) => {
  const allKeys =Object.keys(paths).join(',');
  const each = Object.keys(paths)
    .map(iconName => eachTemplate(iconName, paths[iconName]))
    .join("");
  return each +  allTemplate(allKeys);
};
