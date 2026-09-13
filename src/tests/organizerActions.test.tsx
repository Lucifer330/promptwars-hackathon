import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventProvider, useEventContext } from '../context/EventContext';

const OrganizerTestComponent = () => {
  const {
    sessions,
    announcements,
    addAnnouncement,
    updateSession,
    triggerSimulatedAlert,
  } = useEventContext();

  return (
    <div>
      <span data-testid="ann-count">{announcements.length}</span>
      <span data-testid="first-session-capacity">{sessions[0]?.capacity}</span>

      <button onClick={() => addAnnouncement('Urgent Notice', 'Weather Advisory', 'URGENT')}>
        Publish Urgent Broadcast
      </button>

      <button
        onClick={() => {
          if (sessions[0]) {
            updateSession({ ...sessions[0], capacity: 1500 });
          }
        }}
      >
        Expand Capacity
      </button>

      <button onClick={triggerSimulatedAlert}>Trigger Simulation Alert</button>
    </div>
  );
};

describe('Organizer Dashboard & Operational Actions', () => {
  it('allows organizer to publish announcements and updates count', () => {
    render(
      <EventProvider>
        <OrganizerTestComponent />
      </EventProvider>
    );

    const initialCount = parseInt(screen.getByTestId('ann-count').textContent || '0');
    fireEvent.click(screen.getByText('Publish Urgent Broadcast'));

    expect(screen.getByTestId('ann-count')).toHaveTextContent(String(initialCount + 1));
  });

  it('allows editing session capacity', () => {
    render(
      <EventProvider>
        <OrganizerTestComponent />
      </EventProvider>
    );

    fireEvent.click(screen.getByText('Expand Capacity'));
    expect(screen.getByTestId('first-session-capacity')).toHaveTextContent('1500');
  });

  it('triggers simulated demo alert and broadcasts announcement', () => {
    render(
      <EventProvider>
        <OrganizerTestComponent />
      </EventProvider>
    );

    const initialCount = parseInt(screen.getByTestId('ann-count').textContent || '0');
    fireEvent.click(screen.getByText('Trigger Simulation Alert'));

    expect(parseInt(screen.getByTestId('ann-count').textContent || '0')).toBeGreaterThan(initialCount);
  });
});
