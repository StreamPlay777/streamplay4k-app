import LegalPage from '../../components/LegalPage';
import { terms } from '../../data/legal';
import { routes } from '../../data/site';

export default function Terms() {
  return <LegalPage doc={terms} path={routes.terms} />;
}
