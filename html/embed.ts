
import decorator from '../utils/decorator'
import './styles/embed';
import name from './names/embed';

export default (...children: any) => <HTMLEmbedElement><unknown>decorator(name, children);
