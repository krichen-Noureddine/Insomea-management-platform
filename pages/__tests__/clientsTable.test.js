import React from 'react';
import { render, screen } from '@testing-library/react';
import ClientsTable from '@/components/clientstable';
import { useRouter } from 'next/router';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ClientsTable', () => {
  beforeEach(() => {
    // Mock the router object
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    }));
  });

  it('renders clients', () => {
    const clients = [
      {
        _id: '1',
        companyName: 'Company A',
        contactName: 'John Doe',
        contactEmail: 'john.doe@example.com',
        contactPhone: '123-456-7890',
        clientLocation: 'Location A',
        clientAdresse: 'Address A',
        azureTenantId: 'tenant-1',
      },
      {
        _id: '2',
        companyName: 'Company B',
        contactName: 'Jane Doe',
        contactEmail: 'jane.doe@example.com',
        contactPhone: '987-654-3210',
        clientLocation: 'Location B',
        clientAdresse: 'Address B',
        azureTenantId: 'tenant-2',
      },
    ];

    render(<ClientsTable clients={clients} setClients={() => {}} onEdit={() => {}} />);

    // Check if the clients' data is displayed in the table
    clients.forEach(client => {
      expect(screen.getByText(client.companyName)).toBeInTheDocument();
      expect(screen.getByText(client.contactName)).toBeInTheDocument();
      expect(screen.getByText(client.contactEmail)).toBeInTheDocument();
      expect(screen.getByText(client.contactPhone)).toBeInTheDocument();
      expect(screen.getByText(client.clientLocation)).toBeInTheDocument();
      expect(screen.getByText(client.clientAdresse)).toBeInTheDocument();
      expect(screen.getByText(client.azureTenantId)).toBeInTheDocument();
    });
  });

  afterEach(() => {
    // Reset the mock after each test
    useRouter.mockReset();
  });
});
