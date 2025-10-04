export type JsonPrimative = string | number | boolean;
export type JsonArray = IJson[];
export type JsonObject = { [key: string]: IJson };
export type JsonComposite = JsonArray | JsonObject;
export type IJson = JsonPrimative | JsonComposite;
