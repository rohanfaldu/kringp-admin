import React from 'react';
import Button from '../ui/button/Button';
interface ConfirmPopupProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    title?: string;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
    isOpen,
    message,
    onConfirm,
    onCancel,
    confirmText = "Yes",
    cancelText = "No",
    title = "Confirm"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#10182842] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-3">
                    <Button
                        size="sm"
                        variant={'outline'}
                        onClick={() => onCancel()}
                      >
                        {cancelText}
                    </Button>
                    <Button
                        size="sm"
                        variant={'primary'}
                        onClick={() => onConfirm()}
                      >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;