import React, { ForwardedRef, useEffect, useState } from "react";

interface FileInputProps {
  label: string;
  className?: string;
  fileName?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void; // Optional clear handler
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, className = "", fileName: propFileName = "", onChange, onClear }, ref: ForwardedRef<HTMLInputElement>) => {
    const [fileName, setFileName] = useState<string>(propFileName);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.files?.[0]?.name || "";
      setFileName(name);
      onChange?.(e);
    };

    useEffect(() => {
      if (propFileName) {
        setFileName(propFileName);
      }
    }, [propFileName]);

    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative group">
          {/* Invisible file input */}
          <input
            type="file"
            ref={ref}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleChange}
          />
          {/* Styled container */}
          <div className="flex items-center h-12 w-full rounded-lg border border-dashed border-gray-300 bg-white px-4 text-sm text-gray-700 shadow-sm hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="w-5 h-5 mr-3 text-gray-400">
              📁
            </span>
            <span
              className={`flex-1 truncate ${
                fileName ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {fileName || "No file chosen. Click to browse..."}
            </span>
            {fileName && onClear ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFileName("");
                  onClear();
                }}
                className="ml-2 text-gray-400 hover:text-red-500"
                title="Clear"
              >
                ❌
              </button>
            ) : (
              <span className="text-blue-500 font-medium group-hover:underline">
                Browse
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default FileInput;
