
import decorator from '../utils/decorator'
import './styles/style';
import name from './names/style';

export default (...children: any) => <HTMLStyleElement><unknown>decorator(name, children);
