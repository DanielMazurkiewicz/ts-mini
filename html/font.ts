
import { decorator } from '../utils/base'
import './styles/font';
import name from './names/font';

export default (...children: any) => <HTMLFontElement><unknown>decorator(name, children);
