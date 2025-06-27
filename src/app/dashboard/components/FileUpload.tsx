'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFileDrop: (files: FileList) => void;
}

export const FileUpload = ({ onFileUpload, onFileDrop }: FileUploadProps) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        onFileDrop(files);
    };

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Student Data</h3>
            <p className="text-gray-600 mb-4">
                Drag and drop your CSV file here or click to browse.
                <br />
                The uploaded file should include: <strong>Name</strong>, <strong>Email</strong>, <strong>Subject</strong>, <strong>Mark</strong>, and <strong>Exam Date</strong>.
            </p>
            <input
                type="file"
                accept=".csv"
                onChange={onFileUpload}
                className="hidden"
                id="file-upload"
            />
            <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
            >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
            </label>
        </div>
    );
};

