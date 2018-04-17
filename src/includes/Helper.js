import vUrl from 'valid-url';
export class Helper {
    validUrl(str) {
        return vUrl.isUri(str);
    }
    validDate(d) {
        if (Object.prototype.toString.call(d) === "[object Date]") {
            if (isNaN(d.getTime())) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
}
