import { useState, useRef, useEffect } from "react";
import isEqual from "lodash/isEqual";

/**
 * Get the previous values
 * @param value
 */
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 *
 * @param {function} callback  Callback function to execute in useEffect
 * @param {array} deps useEffect dependencies
 * @param {(function|array)} values Array of deps (all or a subset) to compare and execute callback if changed.
 * Additional it also supports function which is passed previous and current dependencies and is expected to return true|false to execute callback.
 *
 * @example
 * //This custom hook will replace the following code
 *
 * const prevFilters = usePrevious(filters);
 * useEffect(() => {
 *  if(!isEqual(prevFilters, filters)){
 *    ..... some code here
 *  }
 * }, [list, filters])
 *
 * //with the following
 * useConditionalEffect(() => { .... some code here}, [list, filters], [filters])
 *
 * //Also accepts function which will compare deps
 * useConditionalEffect(() => { .... some code here}, [list, filters], (prevDeps, deps) => isEqual(prevDeps[1], deps[1]))
 */
function useConditionalEffect(
  callback: Function,
  deps: Array<any>,
  values: Array<any> | Function
): void {
  const prevValues = usePrevious(values);
  const prevDeps = usePrevious(deps);
  let exeCallBack = values === undefined;

  if (typeof values === "function") {
    exeCallBack = values(prevDeps, deps);
  } else if (Array.isArray(values)) {
    exeCallBack = !isEqual(prevValues, values);
  }
  useEffect(() => {
    if (exeCallBack) {
      callback();
    }
  }, [...deps, callback, exeCallBack]);
}

module.exports = useConditionalEffect;
