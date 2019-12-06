
import { decorator } from '../utils/base'
import './styles/meta';
import name from './names/meta';

export default (...children: any) => <HTMLMetaElement><unknown>decorator(name, children);
