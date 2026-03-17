import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TickerInput } from '../TickerInput';

describe('TickerInput Component', () => {
    it('renders input and buttons correctly', () => {
        render(<TickerInput onAnalyze={vi.fn()} isLoading={false} disabled={false} />);
        
        expect(screen.getByPlaceholderText(/Enter Ticker/i)).toBeInTheDocument();
        expect(screen.getByText('Analyze & Predict')).toBeInTheDocument();
        expect(screen.getByText('1 month')).toBeInTheDocument(); // Default horizon
    });

    it('disables input and button when isLoading is true', () => {
        render(<TickerInput onAnalyze={vi.fn()} isLoading={true} disabled={false} />);
        
        const input = screen.getByPlaceholderText(/Enter Ticker/i);
        const button = screen.getByRole('button', { name: /Analyzing/i });

        expect(input).toBeDisabled();
        expect(button).toBeDisabled();
    });

    it('disables input when rate limit (disabled prop) is true', () => {
        render(<TickerInput onAnalyze={vi.fn()} isLoading={false} disabled={true} />);
        
        const input = screen.getByPlaceholderText(/Enter Ticker/i);
        expect(input).toBeDisabled();
    });

    it('calls onAnalyze with correct uppercase ticker when submitted', () => {
        const mockOnAnalyze = vi.fn();
        render(<TickerInput onAnalyze={mockOnAnalyze} isLoading={false} disabled={false} />);
        
        const input = screen.getByPlaceholderText(/Enter Ticker/i);
        const button = screen.getByRole('button', { name: /Analyze & Predict/i });

        fireEvent.change(input, { target: { value: 'aapl' } });
        fireEvent.click(button);

        expect(mockOnAnalyze).toHaveBeenCalledWith('AAPL', '1 month');
    });

    it('does not call onAnalyze if ticker is empty', () => {
        const mockOnAnalyze = vi.fn();
        render(<TickerInput onAnalyze={mockOnAnalyze} isLoading={false} disabled={false} />);
        
        const button = screen.getByRole('button', { name: /Analyze & Predict/i });
        fireEvent.click(button);

        expect(mockOnAnalyze).not.toHaveBeenCalled();
    });
});
