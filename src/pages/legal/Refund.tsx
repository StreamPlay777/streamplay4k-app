import LegalPage from '../../components/LegalPage';
import { refund } from '../../data/legal';
import { routes } from '../../data/site';

export default function Refund() {
  return <LegalPage doc={refund} path={routes.refund} />;
}
