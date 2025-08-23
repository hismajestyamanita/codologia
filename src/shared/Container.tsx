import React from 'react';

type Props = React.PropsWithChildren<{ className?: string }>;

export default function Container({ children, className = '' }: Props) {
  return (
    <div className={`container ${className}`}>
      {children}
    </div>
  );
}