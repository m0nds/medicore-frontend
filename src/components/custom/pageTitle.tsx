import { ChevronLeft } from 'lucide-react';
import React, { type ReactNode } from 'react'

interface PageTitleProps {
  text?: string;
  returnText?: string;
  description?: string;
  children?: ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ text, returnText, description, children }) => {
  const returnPage = () => {
    window.history.back();
  }

  return (
    <div className='flex items-center justify-between'>
      {returnText && (
        <div
          className="flex flex-col gap-2 cursor-pointer"
          onClick={returnPage}
        >
          <div className='flex items-center gap-1 text-code-sm hover:underline'>
            <ChevronLeft className="size-4" />
            <p>Back</p>
          </div>
          <h2 className="font-heading text-h2 font-bold text-gray-900">{returnText}</h2>
        </div>
      )}

      {text && (
        <div
          className="flex flex-col gap-1"
        >
          <h2 className="font-heading text-h2 font-bold text-gray-900">{text}</h2>
          <p className='text-label text-gray-400'>{description}</p>
        </div>
      )}

      {children}
    </div>
  );
}

export default PageTitle