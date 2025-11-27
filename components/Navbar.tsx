import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shirt, Menu, X } from 'lucide-react';

// --- Minimal Router Implementation (Polyfill for react-router-dom) ---
interface RouterContextType {
  currentPath: string;
  navigate: (to: string, options?: { state?: any }) => void;
  state: any;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
  state: null,
});

export const HashRouter: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string, options?: { state?: any }) => {
    if (options?.state) {
      setState(options.state);
    }
    window.location.hash = to;
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, state }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Routes: React.FC<{children: ReactNode}> = ({ children }) => {
  const { currentPath } = useContext(RouterContext);
  let matchedChild: ReactNode = null;
  
  React.Children.forEach(children, (child) => {
    if (matchedChild) return;
    if (React.isValidElement(child)) {
      const props = child.props as any;
      if (props.path === currentPath) {
        matchedChild = child;
      }
    }
  });
  
  return <>{matchedChild}</>;
};

export const Route: React.FC<{path: string, element: ReactNode}> = ({ element }) => {
  return <>{element}</>;
};

export const Link: React.FC<{to: string, className?: string, children: ReactNode, onClick?: () => void, state?: any}> = ({ to, className, children, onClick, state }) => {
  const { navigate } = useContext(RouterContext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to, { state });
  };
  
  const href = to.startsWith('/') ? '#' + to : '#' + '/' + to;

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export const useLocation = () => {
  const { currentPath, state } = useContext(RouterContext);
  return { pathname: currentPath, state };
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};
// --- End Router Implementation ---

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-orange-600';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-orange-600 p-1.5 rounded-lg">
                <Shirt className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Clo Vsual</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/projects" className={isActive('/projects')}>Projects</Link>
            <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
            <div className="text-gray-400">|</div>
            <Link to="/projects" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Masuk
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">Home</Link>
            <Link to="/projects" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">Projects</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">Pricing</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;