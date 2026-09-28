import React from 'react';

export function CoffeeBeanIcon({
  size = 18,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Outer Coffee Bean Body */}
      <path
        d="M12 2.5C7.2 2.5 3.5 6.8 3.5 12C3.5 17.2 7.2 21.5 12 21.5C16.8 21.5 20.5 17.2 20.5 12C20.5 6.8 16.8 2.5 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Characteristic Coffee Bean S-curve seam */}
      <path
        d="M12 3.5C9.5 7.5 9 10 12.2 12C15.4 14 14.8 17 12 20.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
