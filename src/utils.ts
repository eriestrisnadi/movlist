import React from "react";

export const useOnceEffect = (callback: () => void) => {
  const hasRunOnce = React.useRef(false);

  React.useEffect(() => {
    if (!hasRunOnce.current) {
      callback();
      hasRunOnce.current = true;
    }
  }, [callback]);
};

export const useDebounce = <F extends (...args: any) => any>(
  func: F,
  waitFor: number = 500
): ((...args: Parameters<F>) => ReturnType<F>) => {
  const timer = React.useRef<NodeJS.Timer | null>();
  const savedFunc = React.useRef<F | null>(func);

  React.useEffect(() => {
    savedFunc.current = func;
  }, [waitFor, func, savedFunc]);

  return React.useCallback(
    (...args: any) => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      timer.current = setTimeout(() => savedFunc.current?.(...args), waitFor);
    },
    [waitFor]
  ) as (...args: Parameters<F>) => ReturnType<F>;
};

export const range = (
  start: number,
  end: number,
  step: number = 1,
  offset: number = 0
) => {
  if (!end) {
    end = start;
    start = 0;
  }

  const len = (Math.abs(end - start) + (offset || 0) * 2) / (step || 1) + 1;
  const direction = start < end ? 1 : -1;
  const startingPoint = start - direction * (offset || 0);
  const stepSize = direction * (step || 1);

  return new Array(len).fill(0).map((_, index) => {
    return startingPoint + stepSize * index;
  });
};

export const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

export const guid = () => {
  const len = [8, 4, 4, 4, 12];
  const parts: any = [];

  for (let i = 0; i < len.length; i++) {
    const x = len[i];
    const generated = range(1, x / 4)
      .map(() => s4())
      .join("");

    parts.push(generated);
  }

  return parts.join("-");
};

export type WithGuid<T = Record<string, any>> = { guid: string } & T;

export const withGuid = <T = Record<string, any>>(data: T): WithGuid<T> => {
  const origin = ((data || {}) as any).guid;

  return {
    guid: typeof origin === "string" ? origin : guid(),
    ...data,
  };
};

export const generateReducerMap = <M, T>(target: M, thunk: T) => ({
  target,
  thunk,
});
