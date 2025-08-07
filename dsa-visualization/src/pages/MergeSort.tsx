import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

type Props = {
  onUpdate: (val: number) => void;
};

type index = {
  value: number;
};

const array = new Array(16);

function merge(arr: number[], l: number, mid: number, r: number): void {
  const n = l + r;
  let lcount = 0;
  let rcount = mid;
  let newarray: number[] = [];
  for (let i = 0; i < n; i++) {
    if (arr[lcount] <= arr[rcount]) {
      newarray[i] = arr[lcount];
      lcount++;
    } else if (arr[lcount] > arr[rcount]) {
      newarray[i] = arr[rcount];
      rcount++;
    } else if (lcount === mid) {
      newarray[i] = arr[rcount];
      rcount++;
    } else {
      newarray[i] = arr[lcount];
      lcount++;
    }
  }
  for (let i = 0; i < n; i++) arr[i] = newarray[i];
}

function mergesort(arr: number[], l: number, r: number): void {
  if (l < r) {
    const mid = Math.floor((l + r) / 2);
    mergesort(arr, l, mid);
    mergesort(arr, mid + 1, r);
    merge;
  }
}
