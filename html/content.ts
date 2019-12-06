
import { decorator } from '../utils/base'
import './styles/content';
import name from './names/content';

// TODO: Find type that is returned
export default (...children: any) => decorator(name, children);
