"use client";

import React, { RefObject } from "react";
import ReactQuill from "react-quill";

import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  ref: RefObject<ReactQuill>;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const Quill = ({
  ref,
  value,
  placeholder,
  onChange
}: EditorProps) => {
  return (
    <div className="bg-white">
      <ReactQuill
        ref={ref}
        theme="snow"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}

export const Editor = React.forwardRef<ReactQuill, EditorProps>((props, ref) => <Quill {...props} />);