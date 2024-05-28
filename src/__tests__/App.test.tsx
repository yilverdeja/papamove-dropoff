// Imports
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
	render,
	screen,
	cleanup,
	fireEvent,
	waitFor,
} from '@testing-library/react';

// To Test
import App from '../App';

// Mock the hooks
vi.mock('../hooks/useCreateRoute', () => {
	return {
		default: vi.fn(() => ({
			createRoute: vi.fn(),
			token: null,
			loading: false,
			error: null,
		})),
	};
});

vi.mock('../hooks/useFetchRoute', () => {
	return {
		default: vi.fn(() => ({
			fetchRoute: vi.fn(),
			route: null,
			loading: false,
			error: null,
		})),
	};
});

import useCreateRoute from '../hooks/useCreateRoute';
import useFetchRoute from '../hooks/useFetchRoute';

// Tests
describe('Render App', () => {
	it('Should render the page correctly', async () => {
		render(<App />);
		const h1 = await screen.queryByText('Papamove');
		const inputText1 = await screen.getByLabelText(/dropoff point/i);
		const inputText2 = await screen.getByLabelText(/starting location/i);
		expect(h1).toBeInTheDocument();
		expect(inputText1).toBeInTheDocument();
		expect(inputText2).toBeInTheDocument();
	});
});

describe('Render App Results', async () => {
	beforeEach(() => {
		// Reset all implementations before each test
		useCreateRoute.mockReturnValue({
			createRoute: vi.fn(),
			token: null,
			loading: false,
			error: null,
		});
		useFetchRoute.mockReturnValue({
			fetchRoute: vi.fn(),
			route: null,
			loading: false,
			error: null,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		cleanup();
	});

	it('should handle a failed create route', async () => {
		useCreateRoute.mockReturnValue({
			createRoute: vi
				.fn()
				.mockRejectedValue(new Error('Internal Server Error')),
			token: null,
			loading: false,
			error: new Error('Internal Server Error'),
		});

		render(<App />);
		const button = screen.getByRole('button', { name: /submit/i });
		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByText(/error/i)).toBeInTheDocument();
		});
	});

	it('should handle create success and fetch route data success', async () => {
		useCreateRoute.mockReturnValue({
			createRoute: vi.fn().mockResolvedValue({ token: '123' }),
			token: '123',
			loading: false,
			error: null,
		});

		useFetchRoute.mockReturnValue({
			fetchRoute: vi.fn(),
			route: {
				path: [
					['1', '2'],
					['1', '2'],
					['1', '2'],
				],
				status: 'success',
				total_distance: 1,
				total_time: 2,
			},
			loading: false,
			error: null,
		});

		render(<App />);
		const button = screen.getByRole('button', { name: /submit/i });
		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByText(/distance/i)).toBeInTheDocument();
			expect(screen.getByText(/time/i)).toBeInTheDocument();
		});
	});

	it('should handle create success and fetch route data failure', async () => {
		useCreateRoute.mockReturnValue({
			createRoute: vi.fn().mockResolvedValue({ token: '123' }),
			token: '123',
			loading: false,
			error: null,
		});

		useFetchRoute.mockReturnValue({
			fetchRoute: vi.fn(),
			route: {
				status: 'failure',
				error: 'Location not accessible by car',
			},
			loading: false,
			error: null,
		});

		render(<App />);
		const button = screen.getByRole('button', { name: /submit/i });
		fireEvent.click(button);

		await waitFor(() => {
			expect(
				screen.getByText(/location not accessible by car/i)
			).toBeInTheDocument();
		});
	});

	it('should handle create success and fetch route data fails after max retries', async () => {
		useCreateRoute.mockReturnValue({
			createRoute: vi.fn().mockResolvedValue({ token: '123' }),
			token: '123',
			loading: false,
			error: null,
		});

		useFetchRoute.mockReturnValue({
			fetchRoute: vi.fn(),
			route: {
				status: 'in progress',
			},
			loading: false,
			error: new Error('Unable to fetch route'),
		});

		render(<App />);
		const button = screen.getByRole('button', { name: /submit/i });
		fireEvent.click(button);

		await waitFor(() => {
			expect(
				screen.getByText(/unable to fetch route/i)
			).toBeInTheDocument();
		});
	});

	it('should handle create success and fetch fail', async () => {
		useCreateRoute.mockReturnValue({
			createRoute: vi.fn().mockResolvedValue({ token: '123' }),
			token: '123',
			loading: false,
			error: null,
		});

		useFetchRoute.mockReturnValue({
			fetchRoute: vi
				.fn()
				.mockRejectedValue(new Error('Internal Server Error')),
			route: null,
			loading: false,
			error: new Error('Internal Server Change Error'),
		});

		render(<App />);
		const button = screen.getByRole('button', { name: /submit/i });
		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByText(/error/i)).toBeInTheDocument();
		});
	});
});
