// Imports
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
	render,
	screen,
	cleanup,
	fireEvent,
	waitFor,
} from '@testing-library/react';
import { GetRouteResponse } from '../types';

// To Test
import App from '../App.1';

// Type definitions for mocking
interface CreateRouteHook {
	createRoute: () => Promise<void>;
	token: string | null;
	loading: boolean;
	error: Error | null;
}

interface FetchRouteHook {
	fetchRoute: () => Promise<void>;
	route: GetRouteResponse | null;
	loading: boolean;
	error: Error | null;
}

// Helper functions
function setupCreateRouteMock(returnValue: Partial<CreateRouteHook>) {
	useCreateRoute.mockReturnValue(returnValue);
}

function setupFetchRouteMock(returnValue: Partial<FetchRouteHook>) {
	useFetchRoute.mockReturnValue(returnValue);
}

const validCreateRouteData = {
	createRoute: vi.fn().mockResolvedValue({ token: '123' }),
	token: '123',
	loading: false,
	error: null,
};

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

describe('Render App Results', () => {
	beforeEach(() => {
		// Reset all implementations before each test
		setupCreateRouteMock({
			createRoute: vi.fn(),
			token: null,
			loading: false,
			error: null,
		});
		setupFetchRouteMock({
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
		setupCreateRouteMock({
			createRoute: vi
				.fn()
				.mockRejectedValue(
					new Error('Request failed with status code 500')
				),
			token: null,
			loading: false,
		});

		render(<App />);
		const button = screen.getByRole('button', { name: /submit/i });
		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByText(/error/i)).toBeInTheDocument();
		});
	});

	it('should handle create success and fetch route data success', async () => {
		setupCreateRouteMock(validCreateRouteData);

		setupFetchRouteMock({
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
		setupCreateRouteMock(validCreateRouteData);

		setupFetchRouteMock({
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

	it('should handle create success and fetch fail', async () => {
		setupCreateRouteMock(validCreateRouteData);

		setupFetchRouteMock({
			fetchRoute: vi
				.fn()
				.mockRejectedValue(
					new Error('Request failed with status code 500')
				),
			route: null,
			loading: false,
		});

		render(<App />);
		const button = screen.getByRole('button', { name: /submit/i });
		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByText(/error/i)).toBeInTheDocument();
		}).catch((err) => console.log(err));
	});
});
