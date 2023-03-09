import { Pipe, PipeTransform, Provider } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Pipe({
    name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {

    constructor(
        private http: HttpClient,
        // private auth: Provider, // our service that provides us with the authorization token
    ) { }

    async transform(src: string): Promise<string> {
        if (!this.validURL(src)) {
            return src;
        } else {
            const token = localStorage.getItem('session-token');
            const headers = new HttpHeaders({ 'Authorization': token });
            try {
                const imageBlob = await this.http.get(src, { responseType: 'blob' }).toPromise();
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(imageBlob);
                });
            } catch {
                return './assets/img/avatar/avatar.png';
            }
        }
    }

    validURL(str: string) {
        var pattern = new RegExp(
            '^(https?:\\/\\/)?' // protocol
            // + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
            // + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
            // + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
            // + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
            // + '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
        );
        return !!pattern.test(str);
    }
}