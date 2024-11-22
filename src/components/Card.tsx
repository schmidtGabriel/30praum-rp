import { PropsWithChildren } from 'react';

export default function Card(
  props: PropsWithChildren<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
  >
) {
  return (
    <div
      {...props}
      className={
        'rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 text-slate-900 dark:text-slate-200' +
        ' ' +
        props.className
      }
    >
      {props.children}
    </div>
  );
}
