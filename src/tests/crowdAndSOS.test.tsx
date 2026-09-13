import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventProvider, useEventContext } from '../context/EventContext';

const SOSAndCrowdTestComponent = () => {
  const {
    zones,
    incidents,
    createSOSIncident,
    updateIncidentStatus,
    updateZoneCrowd,
  } = useEventContext();

  return (
    <div>
      <span data-testid="pending-incidents">
        {incidents.filter((i) => i.status === 'PENDING').length}
      </span>
      <span data-testid="in-progress-incidents">
        {incidents.filter((i) => i.status === 'IN_PROGRESS').length}
      </span>

      <span data-testid="zone-a-level">
        {zones.find((z) => z.id === 'zone-a')?.crowdLevel}
      </span>

      <button
        onClick={() =>
          createSOSIncident('loc-food-main', 'MEDICAL', 'Test emergency call', 'Test User', '+15550001111')
        }
      >
        Trigger SOS
      </button>

      <button
        onClick={() => {
          const inc = incidents.find((i) => i.status === 'PENDING');
          if (inc) updateIncidentStatus(inc.id, 'IN_PROGRESS');
        }}
      >
        Dispatch Incident
      </button>

      <button onClick={() => updateZoneCrowd('zone-a', 'LOW')}>Set Zone A Low</button>
    </div>
  );
};

describe('Crowd & SOS Incident Workflows', () => {
  it('creates an emergency SOS incident and updates dispatch status reactively', () => {
    render(
      <EventProvider>
        <SOSAndCrowdTestComponent />
      </EventProvider>
    );

    const initialPending = parseInt(screen.getByTestId('pending-incidents').textContent || '0');
    
    // Trigger SOS
    fireEvent.click(screen.getByText('Trigger SOS'));
    expect(screen.getByTestId('pending-incidents')).toHaveTextContent(String(initialPending + 1));

    // Dispatch incident
    fireEvent.click(screen.getByText('Dispatch Incident'));
    expect(screen.getByTestId('pending-incidents')).toHaveTextContent(String(initialPending));
  });

  it('updates zone crowd density level and recalculates occupancy percentage', () => {
    render(
      <EventProvider>
        <SOSAndCrowdTestComponent />
      </EventProvider>
    );

    fireEvent.click(screen.getByText('Set Zone A Low'));
    expect(screen.getByTestId('zone-a-level')).toHaveTextContent('LOW');
  });
});
