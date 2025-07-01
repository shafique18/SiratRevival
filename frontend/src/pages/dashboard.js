import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Visual from './Visual';
import Gamified from './Gamified';
import Logic from './Logic';
import Deep from './Deep';
import Admin from './Admin';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  if (!user) return <div>Please log in</div>;

  switch(user.age_group) {
    case '0-5': return <Visual />;
    case '6-15': return <Gamified />;
    case '16-25': return <Logic />;
    case '26+': return <Deep />;
    case 'admin': return <Admin />;
    default: return <div>Unknown group</div>;
  }
}
