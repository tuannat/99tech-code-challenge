import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should handle value changes', async () => {
    const user = userEvent.setup();
    const mockChange = jest.fn();
    
    render(<Input onChange={mockChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello');
    
    expect(mockChange).toHaveBeenCalled();
  });

  it('should render with default value', () => {
    render(<Input defaultValue="Default text" />);
    
    expect(screen.getByDisplayValue('Default text')).toBeInTheDocument();
  });

  it('should render with controlled value', () => {
    render(<Input value="Controlled" onChange={() => {}} />);
    
    expect(screen.getByDisplayValue('Controlled')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-input');
  });

  it('should apply default styles', () => {
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-transparent',
      'px-3',
      'py-1'
    );
  });

  it('should render different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />);
    
    let input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');
    
    rerender(<Input type="number" data-testid="input" />);
    input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('should not accept input when disabled', async () => {
    const user = userEvent.setup();
    const mockChange = jest.fn();
    
    render(<Input disabled onChange={mockChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello');
    
    expect(mockChange).not.toHaveBeenCalled();
  });

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup();
    const mockFocus = jest.fn();
    const mockBlur = jest.fn();
    
    render(<Input onFocus={mockFocus} onBlur={mockBlur} />);
    
    const input = screen.getByRole('textbox');
    
    await user.click(input);
    expect(mockFocus).toHaveBeenCalledTimes(1);
    
    await user.tab();
    expect(mockBlur).toHaveBeenCalledTimes(1);
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should pass through HTML input attributes', () => {
    render(
      <Input
        id="test-input"
        name="testName"
        maxLength={100}
        required
        data-testid="input"
        aria-label="Test input"
      />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'testName');
    expect(input).toHaveAttribute('maxLength', '100');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-label', 'Test input');
  });

  it('should handle keyboard events', async () => {
    const user = userEvent.setup();
    const mockKeyDown = jest.fn();
    const mockKeyUp = jest.fn();
    
    render(<Input onKeyDown={mockKeyDown} onKeyUp={mockKeyUp} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'a');
    
    expect(mockKeyDown).toHaveBeenCalled();
    expect(mockKeyUp).toHaveBeenCalled();
  });

  it('should render with file input type', () => {
    render(<Input type="file" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveClass('file:border-0', 'file:bg-transparent');
  });

  it('should merge className with default classes correctly', () => {
    render(<Input className="border-red-500 text-lg" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('border-red-500', 'text-lg');
    expect(input).toHaveClass('flex', 'h-9', 'w-full'); // Default classes should still be present
  });

  it('should handle special characters in input', async () => {
    const user = userEvent.setup();
    
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    await user.type(input, specialText);
    
    expect(input).toHaveValue(specialText);
  });

  it('should handle copy and paste operations', async () => {
    const user = userEvent.setup();
    
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    
    // Type some text
    await user.type(input, 'Hello World');
    
    // Select all text
    await user.keyboard('{Control>}a{/Control}');
    
    // Copy
    await user.keyboard('{Control>}c{/Control}');
    
    // Clear input
    await user.clear(input);
    
    // Paste
    await user.keyboard('{Control>}v{/Control}');
    
    expect(input).toHaveValue('Hello World');
  });

  it('should maintain focus styles', () => {
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-1',
      'focus-visible:ring-ring'
    );
  });

  it('should handle readonly attribute', () => {
    render(<Input readOnly defaultValue="Read only" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveValue('Read only');
  });
});