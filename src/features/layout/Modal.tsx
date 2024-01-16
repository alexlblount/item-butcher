import React, { useEffect, useRef, useState } from 'react';
import styles from './Modal.module.css';

interface ModalProps extends React.PropsWithChildren {
  isOpen: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
}

export default function Modal({ isOpen, hasCloseBtn = true, onClose, children }: ModalProps) {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  };

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  return (
    <dialog ref={modalRef} onKeyDown={handleKeyDown} className={styles.modal}>
      {hasCloseBtn && (
        <button className={styles.closeButton} onClick={handleCloseModal}>
          Close
        </button>
      )}
      {children}
    </dialog>
  );
}
