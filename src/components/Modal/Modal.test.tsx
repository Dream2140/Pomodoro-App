import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders children and title', () => {
    render(
      <Modal title="Test Modal" onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal title="Test" onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(
      <Modal title="Test" onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal title="Test" onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has correct aria attributes', () => {
    render(
      <Modal title="Accessible Modal" onClose={vi.fn()}>
        <p>Content</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Accessible Modal');
  });
});
