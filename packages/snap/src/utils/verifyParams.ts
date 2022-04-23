type Schema =
  | "string"
  | "number"
  | ["undefined", "string"]
  | ["undefined", "number"]
  | { [key: string]: Schema };
type Schemas = { [key: string]: Schema };

export const verifyParams = (params: any, schema: Schemas) => {
  if (!params) throw new Error("Missing params");

  const schemaKeys = Object.keys(schema);

  schemaKeys.forEach((key) => {
    if (params[key] === null)
      throw new Error(`Value for ${schema[key]} cannot be null`);
    const type = typeof params[key];
    if (type === "function")
      throw new Error(`Value for ${schema[key]} cannot be function`);
    if (
      (Array.isArray(schema[key]) &&
        !(schema[key][0] === type || schema[key][1] === type)) ||
      type !== schema[key]
    )
      throw new Error(`Expected value for ${schema[key]} but got ${type}`);
    if ((schema[key] as "object") === "object")
      verifyParams(params[key], schema[key] as Schemas);
  });
};
