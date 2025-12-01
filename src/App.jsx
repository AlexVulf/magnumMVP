import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Usuario from './pages/Usuario';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './hooks/useAuth';

const App = () => {
  const { isAuthenticated, userRole } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav className='flex gap-4 p-4 bg-[#0a0708] text-white justify-center border-b border-[#ff0050] fixed top-0 left-0 right-0 z-50'>
        <Link to='/'>Home</Link>
        {!isAuthenticated ? (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Registrar</Link>
          </>
        ) : (
          <>
            {userRole === 'ADMIN' && <Link to='/admin'>Admin</Link>}
            <Link to='/usuario'>Usuário</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
      <div className="pt-16 bg-[#0a0708]"> {/* Adiciona padding e cor de fundo */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/usuario' element={<Usuario />} />
          </Route>
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path='/admin' element={<Admin />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
