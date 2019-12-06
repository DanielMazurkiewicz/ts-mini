export const runIfInactive = (callback: () => any, timeInMs = 30) => {
    let debounceId: any = -1;
    return (sureToActivate?: boolean) => {
        if (debounceId >= 0) clearTimeout(debounceId);
        if (sureToActivate !== false) {
            if (sureToActivate === true) {
                callback();
                debounceId = -1;
            } else {
                debounceId = setTimeout(()=> {
                    callback();
                    debounceId = -1;
                }, timeInMs);            
            }
        }
    }
}