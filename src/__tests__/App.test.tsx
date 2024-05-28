// Imports
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// To Test
import App from '../App';

// vi.mock('../hooks/useCreateRoute');

// Tests
describe('Renders main page correctly', async () => {
	// resets all renders after each test
	afterEach(() => {
		cleanup();
	});

	it('Should render the page correctly', async () => {
		// Setup
		render(<App />);
		const h1 = await screen.queryByText('Papamove');
		const inputText1 = await screen.getByLabelText(/dropoff point/i);
		const inputText2 = await screen.getByLabelText(/starting location/i);
		expect(h1).toBeInTheDocument();
		expect(inputText1).toBeInTheDocument();
		expect(inputText2).toBeInTheDocument();
	});

	// it should have a two inputs

	// after entering the start and end, mock submit to use the mock api and show the result
	// it('should handle button click correclty', async () => {
	// 	mockUseCreateRename.mockReturnValue;
	// });
});
