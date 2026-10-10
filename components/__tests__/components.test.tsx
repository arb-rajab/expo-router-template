import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { ErrorMessage } from '../ErrorMessage';
import { LoadingView } from '../LoadingView';
import { Screen } from '../Screen';
import { TextField } from '../TextField';
import { darkColors, lightColors } from '../../theme/colors';

describe('Button', () => {
  it('calls onPress', async () => {
    const onPress = jest.fn();
    await render(<Button title="Go" testID="go" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('go'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores presses and shows a spinner while loading', async () => {
    const onPress = jest.fn();
    await render(<Button title="Go" testID="go" onPress={onPress} loading />);
    await fireEvent.press(screen.getByTestId('go'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByTestId('go-spinner')).toBeTruthy();
    expect(screen.queryByText('Go')).toBeNull();
  });

  it('ignores presses when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button title="Go" testID="go" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByTestId('go'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders the link variant', async () => {
    const onPress = jest.fn();
    await render(<Button variant="link" title="More" testID="more" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('more'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('More')).toBeTruthy();
  });
});

describe('TextField', () => {
  it('forwards text changes', async () => {
    const onChangeText = jest.fn();
    await render(<TextField testID="name" placeholder="Name" value="" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByTestId('name'), 'Ada');
    expect(onChangeText).toHaveBeenCalledWith('Ada');
    expect(screen.queryByTestId('name-error')).toBeNull();
  });

  it('shows the field error', async () => {
    await render(<TextField testID="name" value="" onChangeText={jest.fn()} error="Required" />);
    expect(screen.getByTestId('name-error')).toHaveTextContent('Required');
  });
});

describe('ErrorMessage', () => {
  it('renders nothing without a message', async () => {
    await render(<ErrorMessage testID="err" message={null} />);
    expect(screen.queryByTestId('err')).toBeNull();
  });

  it('renders the message', async () => {
    await render(<ErrorMessage testID="err" message="Boom" />);
    expect(screen.getByTestId('err')).toHaveTextContent('Boom');
  });
});

describe('LoadingView', () => {
  it('renders the optional message', async () => {
    await render(<LoadingView testID="loading" message="Loading devices" />);
    expect(screen.getByTestId('loading')).toBeTruthy();
    expect(screen.getByText('Loading devices')).toBeTruthy();
  });
});

describe('EmptyState', () => {
  it('shows title and message without an action', async () => {
    await render(<EmptyState testID="empty" title="Nothing" message="Add one" />);
    expect(screen.getByText('Nothing')).toBeTruthy();
    expect(screen.getByText('Add one')).toBeTruthy();
    expect(screen.queryByTestId('empty-action')).toBeNull();
  });

  it('runs the action', async () => {
    const onAction = jest.fn();
    await render(<EmptyState testID="empty" title="Nothing" actionLabel="Add" onAction={onAction} />);
    await fireEvent.press(screen.getByTestId('empty-action'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe('Screen', () => {
  it('renders children plain, scrollable and keyboard-avoiding', async () => {
    await render(
      <>
        <Screen testID="plain">
          <Text>plain child</Text>
        </Screen>
        <Screen scroll keyboardAvoiding centered testID="scroll">
          <Text>scroll child</Text>
        </Screen>
      </>
    );
    expect(screen.getByText('plain child')).toBeTruthy();
    expect(screen.getByText('scroll child')).toBeTruthy();
    expect(screen.getByTestId('plain')).toBeTruthy();
    expect(screen.getByTestId('scroll')).toBeTruthy();
  });
});

describe('theme colors', () => {
  it('defines every key in both palettes', () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(lightColors).sort());
  });
});
