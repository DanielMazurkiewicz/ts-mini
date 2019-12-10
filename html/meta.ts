
import decorator from '../utils/decorator'
import './styles/meta';
import name from './names/meta';

export default (...children: any) => <HTMLMetaElement><unknown>decorator(name, children);
