import React from 'react';

export default function Card({ title, description, buttonText, onButtonClick, disabled, children, fullPage }) {
  return (
    <section
      className={
        fullPage
          ? 'bg-neutral-50 border border-neutral-200 shadow-md w-full min-h-screen flex flex-col gap-3 p-0 rounded-none'
          : 'bg-neutral-50 rounded-2xl border border-neutral-200 shadow-md p-6 w-full max-w-xl flex flex-col gap-3 items-center'
      }
    >
      {title && <h2 className="text-2xl font-bold mb-1 tracking-tight text-blue-900 text-center drop-shadow-sm w-full mt-8">{title}</h2>}
      {description && <p className="text-lg text-neutral-600 mb-4 text-center leading-relaxed w-full">{description}</p>}
      <div className="flex-1 flex flex-col w-full items-center justify-center">{children}</div>
      {buttonText && (
        <button
          onClick={onButtonClick}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg font-semibold text-lg shadow hover:from-blue-600 hover:to-blue-700 transition disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 mb-8"
        >
          {buttonText}
        </button>
      )}
    </section>
  );
}
