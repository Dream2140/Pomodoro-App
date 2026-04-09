import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NotificationProvider, useNotification } from '@/context/NotificationContext';
import { NotificationContainer } from './Notification';

function TestNotifier() {
  const { notify } = useNotification();
  return (
    <div>
      <button onClick={() => notify('success', 'Test success')}>Notify Success</button>
      <button onClick={() => notify('error', 'Test error')}>Notify Error</button>
      <NotificationContainer />
    </div>
  );
}

function renderWithProvider() {
  return render(
    <NotificationProvider>
      <TestNotifier />
    </NotificationProvider>,
  );
}

describe('NotificationContainer', () => {
  it('shows notification when triggered', () => {
    renderWithProvider();

    act(() => {
      fireEvent.click(screen.getByText('Notify Success'));
    });

    expect(screen.getByText('Test success')).toBeInTheDocument();
  });

  it('dismisses notification when close button clicked', () => {
    renderWithProvider();

    act(() => {
      fireEvent.click(screen.getByText('Notify Success'));
    });

    expect(screen.getByText('Test success')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Dismiss notification'));

    expect(screen.queryByText('Test success')).not.toBeInTheDocument();
  });

  it('shows error notification', () => {
    renderWithProvider();

    act(() => {
      fireEvent.click(screen.getByText('Notify Error'));
    });

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});
