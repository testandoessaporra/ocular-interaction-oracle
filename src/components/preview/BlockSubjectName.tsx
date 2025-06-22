
import React from 'react';

interface BlockSubjectNameProps {
  subject: string;
}

const BlockSubjectName = ({ subject }: BlockSubjectNameProps) => {
  const formattedSubject = subject.replace('Noções de ', '').replace('Direito ', 'Dir. ');
  
  return (
    <h5 className="font-inter text-sm font-medium leading-tight text-center text-zinc-200
      line-clamp-2 overflow-hidden text-ellipsis
      w-full flex items-center justify-center
      hyphens-auto break-words
      max-h-[48px] min-h-[24px] px-1">
      {formattedSubject}
    </h5>
  );
};

export default BlockSubjectName;
