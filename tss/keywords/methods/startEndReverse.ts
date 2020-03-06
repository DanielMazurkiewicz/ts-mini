import keywordStart from '../start'
import keywordEnd from '../end'
const startEndReverse: Record<string, string> = {
    [keywordStart]: keywordEnd,
    [keywordEnd]: keywordStart
}
export default startEndReverse