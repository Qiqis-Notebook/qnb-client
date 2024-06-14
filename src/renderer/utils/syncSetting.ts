import type { AppSettings } from "@Types/AppSettings";

/**
 * Synchronizes the provided settings object with the default settings,
 * ensuring that all properties from the default settings are present in the provided object.
 * This function is useful for checking and updating settings.
 *
 * @param setting The old settings object to be synchronized with the default settings.
 * @param setting The default settings object.
 * @returns An updated settings object with all properties from the default settings.
 */
export function syncSettings(
  settings: Partial<AppSettings>,
  defaultSettings: AppSettings
): AppSettings {
  const syncedSettings = { ...defaultSettings };

  // Recursive function to sync nested properties
  const syncNestedProperties = (input: any, defaults: any) => {
    for (const key in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, key)) {
        if (typeof defaults[key] === "object" && defaults[key] !== null) {
          // If property is an object, recursively sync its properties
          input[key] = syncNestedProperties(input[key] || {}, defaults[key]);
        } else {
          // If property is not an object, set it to default if missing
          if (!(key in input)) {
            input[key] = defaults[key];
          }
        }
      }
    }
    return input;
  };

  return syncNestedProperties(settings, syncedSettings);
}
