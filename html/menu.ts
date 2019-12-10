
import decorator from '../utils/decorator'
import './styles/menu';
import name from './names/menu';

export default (...children: any) => <HTMLMenuElement><unknown>decorator(name, children);
