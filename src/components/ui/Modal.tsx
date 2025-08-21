// src/components/ui/Modal.tsx
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    className?: string;
}

const Modal = ({ isOpen, onClose, children, title, className = '' }: ModalProps) => {
    const modalRoot = document.getElementById('modal-portal');
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !modalRoot) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity"
            onClick={onClose}
        >
            <div
                className={`relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="text-xl font-bold">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;