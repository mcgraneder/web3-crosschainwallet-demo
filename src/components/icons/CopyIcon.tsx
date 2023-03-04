import React, { useEffect, useState } from "react";
import { UilClipboardNotes, UilCheckCircle } from "@iconscout/react-unicons";

interface CopyIconProps {
  text: string;
  onCopy?: (text: string) => void;
}

function CopyIcon({ text, onCopy }: CopyIconProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (copied) timer = setTimeout(() => setCopied(false), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  async function handleCopy(e: any) {
    e.stopPropagation();
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(text);
      onCopy?.(text);
      setCopied(true);
    } catch (e) {}
  }

  return (
    <button className='p-2 rounded-full bg-black-700' onClick={handleCopy}>
      {!copied && <UilClipboardNotes className='w-4 h-4 text-grey-600 ' />}
      {copied && <UilCheckCircle className='w-4 h-4 text-primary ' />}
    </button>
  );
}

export default CopyIcon;
