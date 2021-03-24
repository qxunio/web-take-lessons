export enum DownType {
    EXCEL = "application/vnd.ms-excel;charset=UTF-8"
}


export class DownUtil {


    /**
     * 下载保存后端返回的文件流对象
     *
     * @param res 文件流对象
     * @param type 文件类型，格式
     * @param filename 文件名
     */
    public static down(res: Blob, type: string, filename: string) {
        let b = new Blob([res], {type: type});
        let u = window.URL.createObjectURL(b);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = u;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
    }
}
