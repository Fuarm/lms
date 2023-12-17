"use client";

import ReactQuill from "react-quill";

import 'react-quill/dist/quill.bubble.css';

interface PreviewProps {
  value: string;
}

export const Preview = ({
  value
}: PreviewProps) => {
  return (
    <ReactQuill
      className="preview-quill"
      theme="bubble"
      value={value}
    />
  );
}