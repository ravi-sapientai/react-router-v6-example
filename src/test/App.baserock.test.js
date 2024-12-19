const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
const App = require('../../src/App').default;

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ slug: 'first-blog-post' }),
  BrowserRouter: ({ children }) => <>{children}</>,
}));

describe('App Component', () => {
  test('renders Home component when navigating to /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Home View')).toBeInTheDocument();
  });

  test('renders About component when navigating to /about', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('About View')).toBeInTheDocument();
  });

  test('renders PostLists component when navigating to /posts', () => {
    render(
      <MemoryRouter initialEntries={['/posts']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Second Blog Post')).toBeInTheDocument();
  });

  test('renders Post component when navigating to a specific post', () => {
    render(
      <MemoryRouter initialEntries={['/posts/first-blog-post']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('First Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Lorem ipsum dolor sit amet, consectetur adip.')).toBeInTheDocument();
  });

  test('renders NoMatch component for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('404: Page Not Found')).toBeInTheDocument();
  });

  test('renders Login component and handles login', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Username:')).toBeInTheDocument();
    expect(screen.getByText('Password:')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  test('redirects to login when accessing protected route without authentication', () => {
    render(
      <MemoryRouter initialEntries={['/stats']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Username:')).toBeInTheDocument();
  });

  test('logs out user when clicking logout', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Login first
    fireEvent.click(screen.getByText('Login'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    // Now logout
    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });
});