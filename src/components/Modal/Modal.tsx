import { useEffect, useRef, type ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
}

export function Modal({ children, onClose, title }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Dialog'}
    >
      <div className={styles.container}>
        <div className={styles.top}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
