let index = 0;
const prefix = '__tsm';

export default () => prefix + (index++).toString(32)