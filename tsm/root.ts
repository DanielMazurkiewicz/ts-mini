import './styles/root';
import decorator from '../utils/decorator';
export default (...children: any) => decorator(document.body, children);
