
import decorator from '../utils/decorator'
import './styles/font';
import name from './names/font';

export default (...children: any) => <HTMLFontElement><unknown>decorator(name, children);
