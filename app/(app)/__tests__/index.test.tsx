import React from 'react';
import { render, screen } from '@testing-library/react-native';

import HomeScreen from '../index';
import { useAuth } from '../../../lib/auth-context';

jest.mock('../../../lib/auth-context', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

describe('HomeScreen', () => {
  it('shows the signed-in email', async () => {
    mockUseAuth.mockReturnValue({ session: { userId: 'u-1', email: 'a@b.com' } });
    await render(<HomeScreen />);
    expect(screen.getByTestId('home-email')).toHaveTextContent(/a@b.com/);
  });

  it('shows the empty-state placeholder', async () => {
    mockUseAuth.mockReturnValue({ session: null });
    await render(<HomeScreen />);
    expect(screen.getByTestId('home-empty')).toBeTruthy();
  });
});
