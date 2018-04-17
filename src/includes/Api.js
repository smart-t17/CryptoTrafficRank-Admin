var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
export class Api {
    constructor(baseUrl, router) {
        this.baseUrl = baseUrl;
        this.router = router;
        this.isLoggedIn = false;
        this.Auth = null;
        const authData = {
            ClientId: '20ncrk8a4tj9ohjokvousq4iv5',
            AppWebDomain: 'crypto-site-traffic.auth.us-east-1.amazoncognito.com',
            TokenScopesArray: ['openid'],
            RedirectUriSignIn: 'https://admin.cryptotrafficrank.com',
            RedirectUriSignOut: 'https://admin.cryptotrafficrank.com'
        };
        this.Auth = new CognitoAuth(authData);
        this.Auth.userhandler = {
            onSuccess: (result) => {
                this.isLoggedIn = true;
                console.log('Auth: Sign in success');
                this.router.push('/');
            },
            onFailure: (err) => {
                this.logout();
            }
        };
        this.Auth.parseCognitoWebResponse(window.location.toString());
        if (this.isUserSignedIn()) {
            this.isLoggedIn = true;
        }
    }
    req(path = '', method = 'GET', inputData = {}, responseType = 'json') {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                method = method || 'GET';
                inputData = inputData || {};
                const extractData = (r) => { return { data: r.response, status: r.status.toString().match(/^2\d+/) ? 200 : r.status }; };
                if (method == 'GET' && Object.keys(inputData).length) {
                    path += '?' + Object.keys(inputData).map((k) => k + '=' + inputData[k]).join('&');
                    inputData = {};
                }
                const token = this.getToken();
                const req = new XMLHttpRequest();
                req.open(method, this.baseUrl + path, true);
                req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                if (token)
                    req.setRequestHeader('Authorization', token);
                req.responseType = responseType;
                req.onloadend = () => {
                    if (req.status == 401 || req.status == 403 || req.status == 0) {
                        this.logout();
                        reject(extractData(req));
                    }
                    else if (req.status == 500) {
                        alert(req.response && req.response.errorMessage ? `Server Error: ${req.response.errorMessage}` : `500 Server Error: ${method} ${path}`);
                        reject(extractData(req));
                    }
                    else
                        resolve(extractData(req));
                };
                req.send(JSON.stringify(inputData));
            });
        });
    }
    get(path, data = null, resType = 'json') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.req(path, 'GET', data, resType);
        });
    }
    post(path, data = null, resType = 'json') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.req(path, 'POST', data, resType);
        });
    }
    put(path, data = null, resType = 'json') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.req(path, 'PUT', data, resType);
        });
    }
    patch(path, data = null, resType = 'json') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.req(path, 'PATCH', data, resType);
        });
    }
    delete(path, data = null, resType = 'json') {
        return __awaiter(this, void 0, void 0, function* () {
            return this.req(path, 'DELETE', data, resType);
        });
    }
    getToken() {
        return this.isUserSignedIn() ? this.Auth.getCachedSession().getIdToken().getJwtToken() : null;
    }
    login() {
        this.Auth.getSession();
    }
    logout() {
        this.Auth.signOut();
    }
    isUserSignedIn() {
        return this.Auth.getCachedSession() != null && this.Auth.getCachedSession().isValid();
    }
}
