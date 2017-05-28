export function toFileName(name: string, extension?: string): string {
    name = name.replace(/ /g, '');
    name = name.toLowerCase();
    if (extension) name = `${name}${extension}`;
    return name;
}