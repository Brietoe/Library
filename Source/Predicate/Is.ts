function Type<T>(data: T)
{
 return typeof data;
}

const { parse, stringify } = JSON;

type NotString<T> = T extends string
 ? never
 : T;

// Implement inverse option
const is =
{
 JSON: (data: unknown): data is Json => // Clean this implementation
 {
  try
  {
   const parsed = parse(stringify(data));
   return is.object(parsed);	//	Do deep compare
  }
  catch (err)
  {
   return false;
  }
 },

 object: (data: unknown): data is { [Property: PropertyKey]: unknown; } =>
  (typeof data === "object" || typeof data === "function")
  && !(data === null),	//	Technically, null is an object in JS but I don't find it very useful here.

 defined: <T>(data: T): data is NonNullable<T> => (data !== undefined && data !== null),
 nothing: (data: unknown): data is Nothing => (data === undefined || data === null),
 function: (data: unknown): data is λ => typeof data === "function",
 boolean: (data: unknown): data is boolean => Type(data) === "boolean",
 number: (data: unknown): data is number => Type(data) === "number",
 symbol: (data: unknown): data is symbol => Type(data) === "symbol",
 bigint: (data: unknown): data is bigint => Type(data) === "bigint",
 string: (data: unknown): data is string => Type(data) === "string",
 null: (data: unknown): data is null => (data === null),
 true: (data: unknown): data is true => data === true,
 array: Array.isArray,
 frozen: <T>(data: T): data is Readonly<T> => Object.isFrozen(data),

 get not()	//	Lets be more elegant here. We should either proxy the 'is' to invert all returns or create a copy or something.
 {
  const inverse =
  {
   object: (data: unknown): data is Primitive => !is.object(data),
   defined: (data: any): data is Nothing => !is.defined(data),
   string: <T>(data: T): data is NotString<T> => Type(data) !== "string",
  };

  return inverse;
 }

};

export default is;
