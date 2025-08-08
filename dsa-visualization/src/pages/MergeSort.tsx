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

const array = new Array(16);

function merge(arr: number[], l: number, mid: number, r: number): void {
  const n = r - l + 1;
  let lcount = l;
  let rcount = mid + 1;
  let newarray: number[] = [];
  for (let i = 0; i < n; i++) {
    if (lcount === mid) {
      newarray[i] = arr[rcount];
      rcount++;
    } else if (rcount === r) {
      newarray[i] = arr[lcount];
      lcount++;
    } else if (arr[lcount] <= arr[rcount]) {
      newarray[i] = arr[lcount];
      lcount++;
    } else {
      newarray[i] = arr[rcount];
      rcount++;
    }
  }
  for (let i = l, j = 0; i < r; i++, j++) arr[i] = newarray[j];
}

function mergesort(arr: number[], l: number, r: number): void {
  if (l < r) {
    const mid = Math.floor((l + r) / 2);
    mergesort(arr, l, mid);
    mergesort(arr, mid + 1, r);
    merge(arr, l, mid, r);
  }
}
