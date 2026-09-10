import LegalPage from '../../components/LegalPage';
import { cookies } from '../../data/legal';
import { routes } from '../../data/site';

export default function Cookies() {
  return <LegalPage doc={cookies} path={routes.cookies} />;
}
