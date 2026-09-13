import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventProvider, useEventContext } from '../context/EventContext';

const TestComponent = () => {
  const { role, setRole, activeView, setActiveView, announcements, addAnnouncement, incidents } = useEventContext();

  return (
    <div>
      <span data-testid="role-span">{role}</span>
      <span data-testid="view-span">{activeView}</span>
      <span data-testid="ann-count">{announcements.length}</span>
      <span data-testid="incidents-count">{incidents.length}</span>

      <button onClick={() => setRole('organizer')}>Switch to Organizer</button>
      <button onClick={() => setActiveView('map')}>Go to Map</button>
      <button onClick={() => addAnnouncement('Test Title', 'Test Msg', 'URGENT')}>Add Test Ann</button>
    </div>
  );
};

describe('EventProvider Context Integration', () => {
  it('provides default values and updates role and active view', () => {
    render(
      <EventProvider>
        <TestComponent />
      </EventProvider>
    );

    expect(screen.getByTestId('role-span')).toHaveTextContent('attendee');
    expect(screen.getByTestId('view-span')).toHaveTextContent('discovery');

    fireEvent.click(screen.getByText('Switch to Organizer'));
    expect(screen.getByTestId('role-span')).toHaveTextContent('organizer');

    fireEvent.click(screen.getByText('Go to Map'));
    expect(screen.getByTestId('view-span')).toHaveTextContent('map');
  });

  it('allows adding announcements reactively', () => {
    render(
      <EventProvider>
        <TestComponent />
      </EventProvider>
    );

    const initialCount = parseInt(screen.getByTestId('ann-count').textContent || '0');
    fireEvent.click(screen.getByText('Add Test Ann'));
    expect(screen.getByTestId('ann-count')).toHaveTextContent(String(initialCount + 1));
  });
});
