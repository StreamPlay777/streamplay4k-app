import LegalPage from '../../components/LegalPage';
import { dmca } from '../../data/legal';
import { routes } from '../../data/site';

export default function Dmca() {
  return <LegalPage doc={dmca} path={routes.dmca} />;
}
