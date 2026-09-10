import LegalPage from '../../components/LegalPage';
import { privacy } from '../../data/legal';
import { routes } from '../../data/site';

export default function Privacy() {
  return <LegalPage doc={privacy} path={routes.privacy} />;
}
