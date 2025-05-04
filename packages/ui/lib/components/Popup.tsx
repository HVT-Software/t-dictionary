import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PopupProps = {
  className?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Popup = ({ className, children, isOpen, onClose }: PopupProps) => {
  return (
    <div className={cn(className, 'modal', isOpen ? 'modal-open' : '')}>
      <div className="modal-box">
        {children}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
