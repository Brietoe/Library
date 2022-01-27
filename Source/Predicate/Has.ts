import is from "./Is.js";

export default function has<S extends string>(property: S)
{
 return function (obj: unknown): obj is Record<S, unknown>
 {
  return is.object(obj) ? Reflect.has(obj, property) : false;
 };
}
