export class CommUtil {


    public static sleep(delay: any) {
        let start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    }
}
