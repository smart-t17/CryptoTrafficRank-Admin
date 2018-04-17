 import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth'


interface AjaxResponse {
    data: any;
    status: number;
}



export class Api {
   
    isLoggedIn:boolean = false;
    Auth:any = null;
    
    constructor(private baseUrl: string, private router: any) {
        const authData = {
            ClientId           : '20ncrk8a4tj9ohjokvousq4iv5',
            AppWebDomain       : 'crypto-site-traffic.auth.us-east-1.amazoncognito.com',
            TokenScopesArray   : ['openid'],
            RedirectUriSignIn  : 'https://admin.cryptotrafficrank.com',
            RedirectUriSignOut : 'https://admin.cryptotrafficrank.com'
        };
        this.Auth = new CognitoAuth(authData);
        //this.Auth.useCodeGrantFlow();
        


        this.Auth.userhandler = {
            onSuccess: (result:any) => {
                this.isLoggedIn = true;
                console.log('Auth: Sign in success');
                this.router.push('/');
            },
            onFailure: (err:any) => {
                //console.error('Auth: Error!');
                this.logout(); 
            }
        };



        this.Auth.parseCognitoWebResponse(window.location.toString());

        if(this.isUserSignedIn()){
            this.isLoggedIn = true;
            /*setInterval( () => {
                this.Auth.getSession();
            }, 10000);*/
        }

        

    }
   

    async req(path = '', method = 'GET', inputData = {}, responseType = 'json') {
        return new Promise((resolve, reject) => {
            method = method || 'GET';
            inputData = inputData || {};

            const extractData = (r: any): AjaxResponse => { return { data: r.response, status: r.status.toString().match(/^2\d+/) ? 200 : r.status } };

            if (method == 'GET' && Object.keys(inputData).length) {
                path += '?' + Object.keys(inputData).map((k) => k + '=' + inputData[k]).join('&');
                inputData = {}
            }

            const token = this.getToken();
            const req = new XMLHttpRequest();
            req.open(method, this.baseUrl + path, true);
            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            if (token)
                req.setRequestHeader('Authorization', token);
            req.responseType = responseType;
            req.onloadend = () => {
                //console.log('req-status:',req.status)
                if (req.status == 401 || req.status == 403 || req.status == 0) {
                    this.logout();
                    reject(extractData(req));
                }
                else if (req.status == 500) {
                    alert(req.response && req.response.errorMessage ? `Server Error: ${req.response.errorMessage}` : `500 Server Error: ${method} ${path}`);
                    reject(extractData(req));
                }
                else resolve(extractData(req));
            };
            req.send(JSON.stringify(inputData));
            
        });
    }


    async get(path: string, data: any = null, resType = 'json') {
        return this.req(path, 'GET', data, resType)
    }
    async post(path: string, data: any = null, resType = 'json') {
        return this.req(path, 'POST', data, resType)
    }
    async put(path: string, data: any = null, resType = 'json') {
        return this.req(path, 'PUT', data, resType)
    }
    async patch(path: string, data: any = null, resType = 'json') {
        return this.req(path, 'PATCH', data, resType)
    }
    async delete(path: string, data: any = null, resType = 'json') {
        return this.req(path, 'DELETE', data, resType)
    }


    getToken() {
        return this.isUserSignedIn() ? this.Auth.getCachedSession().getIdToken().getJwtToken() : null; 
    }

    login(){
        this.Auth.getSession();
    }

    logout() {
        this.Auth.signOut();
    }


    isUserSignedIn(){
        return this.Auth.getCachedSession() != null && this.Auth.getCachedSession().isValid();
    }


}

