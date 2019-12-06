import './styles/root';
import { decorator } from '../utils/base';
export default (...children: any) => decorator(document.body, children);
