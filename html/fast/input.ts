
import input from '../names/input';
export default (type = 'text') => {
    const i = document.createElement(input);
    i.setAttribute('type', type);
    return i;
}
