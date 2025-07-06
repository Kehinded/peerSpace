export function generateDeepDarkGradient(color: string): string {
  // Create a temporary element to use browser's color parsing
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  // Get computed color in rgb format
  const computedColor = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const rgbMatch = computedColor.match(/\d+/g);
  if (!rgbMatch || rgbMatch.length < 3) {
    throw new Error("Invalid color format");
  }

  const [r, g, b] = rgbMatch.map(Number);

  // Create darker and darkest shades
  const midR = Math.floor(r * 0.5);
  const midG = Math.floor(g * 0.5);
  const midB = Math.floor(b * 0.5);

  const endR = Math.floor(r * 0.2);
  const endG = Math.floor(g * 0.2);
  const endB = Math.floor(b * 0.2);

  // Gradient with three stops: start, mid (50%), end (100%)
  const gradient = `linear-gradient(to bottom, rgb(${r}, ${g}, ${b}) 0%, rgb(${midR}, ${midG}, ${midB}) 50%, rgb(${endR}, ${endG}, ${endB}) 100%)`;

  return gradient;
}

export function generateGradientWithImageBackground(
  color: string,
  imageUrl: string
): string {
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  const computedColor = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const rgbMatch = computedColor.match(/\d+/g);
  if (!rgbMatch || rgbMatch.length < 3) {
    throw new Error("Invalid color format");
  }

  const [r, g, b] = rgbMatch.map(Number);

  const midR = Math.floor(r * 0.5);
  const midG = Math.floor(g * 0.5);
  const midB = Math.floor(b * 0.5);

  const endR = Math.floor(r * 0.2);
  const endG = Math.floor(g * 0.2);
  const endB = Math.floor(b * 0.2);

  const gradient = `linear-gradient(to bottom, rgb(${r}, ${g}, ${b}) 0%, rgb(${midR}, ${midG}, ${midB}) 50%, rgb(${endR}, ${endG}, ${endB}) 100%)`;
  return `${gradient}, url(${imageUrl})`;
}

export function generateGradientWithImageBackgroundFromElement(
  classOrIdSelector: string,
  imageUrl: string
): string {
  const element = classOrIdSelector.startsWith("#")
    ? document.getElementById(classOrIdSelector.slice(1))
    : document.querySelector(classOrIdSelector);

  if (!element) {
    throw new Error(`Element "${classOrIdSelector}" not found`);
  }

  const computedColor = getComputedStyle(element).color;
  const rgbMatch = computedColor.match(/\d+/g);

  if (!rgbMatch || rgbMatch.length < 3) {
    throw new Error("Invalid computed color format");
  }

  const [r, g, b] = rgbMatch.map(Number);

  const midR = Math.floor(r * 0.5);
  const midG = Math.floor(g * 0.5);
  const midB = Math.floor(b * 0.5);

  const endR = Math.floor(r * 0.2);
  const endG = Math.floor(g * 0.2);
  const endB = Math.floor(b * 0.2);

  const gradient = `linear-gradient(to bottom, rgb(${r}, ${g}, ${b}) 0%, rgb(${midR}, ${midG}, ${midB}) 50%, rgb(${endR}, ${endG}, ${endB}) 100%)`;

  return `${gradient}, url(${imageUrl})`;
}

type AreEqualParams = {
  paramOne?: any;
  paramTwo?: any;
  checkForEmpty?: boolean;
  ignoreKeys?: string[];
};
/**
 * Recursively checks if a value is considered empty:
 * - null or undefined
 * - string empty after trim
 * - array with length < 1 or all elements empty
 * - object with no keys or all keys empty values
 */

/**
 * Checks if two values are equal under custom rules.
 */
export function isTrulyEmpty(input: any, ignoreKeys: string[] = []): boolean {
  // null or undefined
  if (input === null || input === undefined) return true;
  // string: check after trim
  if (typeof input === "string") {
    return input.trim() === "";
  }
  // array: check if empty
  if (Array.isArray(input)) {
    return input.length === 0;
  }
  // object: check if any non-ignored key has empty value
  if (typeof input === "object") {
    for (const key in input) {
      if (ignoreKeys.includes(key)) continue;
      const value = input[key];
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return true;
      }
    }
  }
  // default: not empty
  return false;
}
export function onlyOneParamExists(paramOne?: any, paramTwo?: any): boolean {
  const isOneDefined = typeof paramOne !== "undefined";
  const isTwoDefined = typeof paramTwo !== "undefined";
  return (isOneDefined && !isTwoDefined) || (!isOneDefined && isTwoDefined);
}
export function ValidateData({
  paramOne,
  paramTwo,
  checkForEmpty = true,
  ignoreKeys = [],
}: AreEqualParams): boolean {
  // Handle case where only one param is passed
  if (onlyOneParamExists(paramOne, paramTwo)) {
    const singleParam = paramOne !== undefined ? paramOne : paramTwo;
    return isTrulyEmpty(singleParam, ignoreKeys);
  }
  // If neither param is provided
  const bothProvided =
    typeof paramOne !== "undefined" && typeof paramTwo !== "undefined";
  if (!bothProvided) {
    return checkForEmpty ? false : true;
  }
  // Check if paramOne has any empty value (ignoring ignoreKeys)
  if (
    checkForEmpty &&
    paramOne &&
    typeof paramOne === "object" &&
    paramTwo &&
    typeof paramTwo === "object" &&
    !Array.isArray(paramOne)
  ) {
    for (const key of Object.keys(paramOne)) {
      if (ignoreKeys.includes(key)) continue;
      if (isTrulyEmpty(paramOne[key])) return true;
    }
  }
  // If one param is empty and the other is not
  if (
    checkForEmpty &&
    (isTrulyEmpty(paramOne, ignoreKeys) || isTrulyEmpty(paramTwo, ignoreKeys))
  ) {
    return false;
  }
  // Strict equality
  if (paramOne === paramTwo) return true;
  // Compare primitives as strings
  if (
    typeof paramOne !== "object" ||
    paramOne === null ||
    typeof paramTwo !== "object" ||
    paramTwo === null
  ) {
    return String(paramOne) === String(paramTwo);
  }
  // Arrays
  if (Array.isArray(paramOne) && Array.isArray(paramTwo)) {
    if (paramOne.length !== paramTwo.length) return false;
    for (let i = 0; i < paramOne.length; i++) {
      if (
        !ValidateData({
          paramOne: paramOne[i],
          paramTwo: paramTwo[i],
          checkForEmpty,
          ignoreKeys,
        })
      ) {
        return false;
      }
    }
    return true;
  }
  // Objects
  if (!Array.isArray(paramOne) && !Array.isArray(paramTwo)) {
    const keys1 = Object.keys(paramOne).filter((k) => !ignoreKeys.includes(k));
    const keys2 = Object.keys(paramTwo).filter((k) => !ignoreKeys.includes(k));
    const allKeys: string[] = Array.from(new Set([...keys1, ...keys2]));
    for (const key of allKeys) {
      if (ignoreKeys.includes(key)) continue;
      if (
        !ValidateData({
          paramOne: paramOne[key],
          paramTwo: paramTwo[key],
          checkForEmpty,
          ignoreKeys,
        })
      ) {
        return false;
      }
    }
    return true;
  }
  // Mismatched types (e.g., one is array, the other is object)
  return false;
}

export function addHashIfNeeded(str: any) {
  if (/\d/.test(str) && !/^#/.test(str)) {
    return "#" + str;
  } else {
    return str;
  }
}

export function formatDateToCustom(dateStr: string): string {
  const date = new Date(dateStr);
  const monthNames = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May.",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function colorToRgba(color: string, opacity: number | string): string {
  const defaultOpacity = opacity || 0.1;
  // Create a temporary div element to parse the color
  const tempDiv = document.createElement("div");
  tempDiv.style.color = color;
  document.body.appendChild(tempDiv);

  // Get computed RGB value
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);

  // Extract RGB values
  const match = computedColor.match(/\d+/g);
  if (!match || match.length < 3) {
    throw new Error("Invalid color format.");
  }

  const [r, g, b] = match.map(Number);
  return `rgba(${r}, ${g}, ${b}, ${defaultOpacity})`;
}
