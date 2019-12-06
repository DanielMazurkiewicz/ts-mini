
import { decorator } from '../utils/base'
import './styles/shadow';
import name from './names/shadow';

// TODO: find type that is returned
export default (...children: any) => decorator(name, children);
