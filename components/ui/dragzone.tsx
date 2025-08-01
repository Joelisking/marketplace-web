'use client';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { Icon } from './icon';

interface FileType {
  name: string;
  size: string;
  file: File; // Store the original file for further use
}

interface Props {
  onChange: (files: FileList | null) => void;
  defaultValue: FileList | null;
  name: string;
}

export function DropZone({ onChange, defaultValue, name }: Props) {
  const [files, setFiles] = useState<FileType[]>([]);

  const updateOnChange = useCallback(
    (updatedFiles: FileType[]) => {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) =>
        dataTransfer.items.add(file.file)
      );
      onChange(dataTransfer.files);
    },
    [onChange] // Dependencies for updateOnChange
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: { name: string; size: string; file: File }[] =
        [];
      acceptedFiles.forEach((file) => {
        if (!files.find((oldFile) => file.name === oldFile.name)) {
          newFiles.push({
            name: file.name,
            size: `${(file.size / 1024).toFixed(2)}KB`,
            file,
          });
        } else {
          toast.info('There already exists a file with this name');
        }
      });

      const mergedFiles = [...files, ...newFiles];
      setFiles(mergedFiles);

      // Use the stable updateOnChange function
      updateOnChange(mergedFiles);
    },
    [files, updateOnChange] // Dependencies for onDrop
  );

  useEffect(() => {
    // console.log("checking the default value", defaultValue);
    if (defaultValue) {
      const uploadedFiles = Array.from(defaultValue || []).map(
        (file) => ({
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)}KB`,
          file,
        })
      );
      setFiles(uploadedFiles);
    } else {
      setFiles([]);
    }
  }, [defaultValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': [],
      'image/jpeg': [], // covers both JPG and JPEG
      'image/webp': [],
      'application/pdf': [],
      'application/msword': [], // DOC
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [], // DOCX
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        [], // XLSX
    },
  });

  const handleFileRemove = (fileName: string) => {
    const updatedFiles = files.filter(
      (file) => file.name !== fileName
    );
    setFiles(updatedFiles);
    updateOnChange(updatedFiles);
  };
  return (
    <div className="w-full">
      <div {...getRootProps()}>
        <input id={name} key={files.length} {...getInputProps()} />
        <div className="flex w-full flex-col items-center rounded-2xl border border-dashed border-neutral-400 p-4">
          <div className="inline-flex cursor-pointer flex-col items-center justify-center rounded-2xl px-4 py-2">
            <Icon name="Image" className="text-neutral-900" />
            {isDragActive ? (
              <span className="text-base">
                Drop the files here ...
              </span>
            ) : (
              <span className="text-base">
                <b className="text-info-500">Upload files</b> or drag
                and drop
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-400">
            PNG, JPG, JPEG, WEBP, PDF, DOC, DOCX, XLSX upto 5MB
          </p>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-2 justify-center gap-x-11 gap-y-8">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex w-full items-center gap-3 rounded-2xl border bg-neutral-50 px-4 py-4">
            <div className="bg-secondary-500 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <Icon name="FileText" className="text-primary-500" />
            </div>
            <div className="flex w-full flex-col">
              <span className="text-base text-neutral-900">
                {file.name}
              </span>
              <span className="text-sm text-neutral-500">
                {file.size}
              </span>
            </div>
            <button
              type="button"
              className="bg-danger-50 flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleFileRemove(file.name);
              }}>
              <Icon name="Trash2" className="text-danger-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
