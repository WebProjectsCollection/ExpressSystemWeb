import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { SpinService } from '../spin/spin.service';
import { throwError, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';

// 请求类型
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const baseUrl = environment.apiurl;

/**
 * http服务
 */
@Injectable()
export class HttpService {

    private setTimeout: number = 10000; // 默认的超时时间

    constructor(
        private http: HttpClient,
        private spinService: SpinService,
        private msg: NzMessageService) { }

    /**
     *  GET请求处理（一般用于获取数据）
     * @param url 后台接口api 例如：/api/values
     */
    public get(url: string, success: Function, error: Function = null) {
        this.spinService.show();
        return this.http.get(this.combineUrl(baseUrl, url), httpOptions).pipe(
            timeout(this.setTimeout),
            map(this.extractData),
            catchError(this.handleError)
        ).subscribe(res => {
            this.spinService.hide();
            success(res)
        }, err => {
            this.spinService.hide();
            if (error != null) {
                error(err);
            } else {
                this.msg.error(err);
            }
        });
    }

    /**
     * POST请求处理（一般用于保存数据）
     * @param url 后台接口api
     * @param data 参数
     */
    public post(url: string, data = {}, success: Function, error: Function = null) {
        this.spinService.show();
        return this.http.post(this.combineUrl(baseUrl, url), data, httpOptions).pipe(
            timeout(this.setTimeout),
            map(this.extractData),
            catchError(this.handleError)
        ).subscribe(res => {
            this.spinService.hide();
            success(res)
        }, err => {
            this.spinService.hide();
            if (error != null) {
                error(err);
            } else {
                this.msg.error(err);
            }
        });
    }
    /**
     * PUT请求处理（一般用于更新数据）
     * @param url 后台接口api 例如：/api/test/6
     * @param data 参数
     */
    public put(url: string, data = {}, success: Function, error: Function = null) {
        this.spinService.show();
        return this.http.put(this.combineUrl(baseUrl, url), data, httpOptions).pipe(
            timeout(this.setTimeout),
            map(this.extractData),
            catchError(this.handleError)
        ).subscribe(res => {
            this.spinService.hide();
            success(res)
        }, err => {
            this.spinService.hide();
            if (error != null) {
                error(err);
            } else {
                this.msg.error(err);
            }
        });
    }
    /**
     * DELETE请求处理（一般用于删除数据）
     * @param url 后台接口api 例如：/api/test/6
     */
    public delete(url: string, success: Function, error: Function = null) {
        this.spinService.show();
        return this.http.delete(this.combineUrl(baseUrl, url), httpOptions).pipe(
            timeout(this.setTimeout),
            map(this.extractData),
            catchError(this.handleError)
        ).subscribe(res => {
            this.spinService.hide();
            success(res)
        }, err => {
            this.spinService.hide();
            if (error != null) {
                error(err);
            } else {
                this.msg.error(err);
            }
        });
    }

    /**
     *  导出数据
     * @param url 返回结果
     */
    public export(url: string) {
        window.open(this.combineUrl(baseUrl, url));
    }

    /**
     *  提取数据
     * @param res 返回结果
     */
    private extractData(res: Response) {
        let body = res;
        return body || {};
    }
    /**
     * 错误消息类
     * @param error
     */
    private handleError(error: HttpErrorResponse) {
        let msg = '请求发生异常';
        if (error.error instanceof ErrorEvent) {
            console.error('**An error occurred:', error.error.message);
        } else {
            console.error(
                `**Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
            let status = error.status,
                resStr = error.error;
            if (status === 0) {
                msg = '请求失败，请求响应出错';
            } else if (status === 404) {
                msg = '请求失败，未找到请求地址';
            } else if (status === 500) {
                msg = '请求失败，服务器出错，请稍后再试';
            } else {
                if (error.hasOwnProperty('name') && error.name.toString() == 'TimeoutError') {
                    /** 请求超时 */
                    msg = '请求失败，请求响应超时';
                } else {
                    console.error(error);
                    msg = "未知错误，请检查网络";
                }
            }
        }
        return throwError(msg);
    }

    public combineUrl(base: string, path: string): string {
        base = base.endsWith('/') ? base.substring(0, base.length - 1) : base;
        path = path.startsWith('/') ? path.substring(1, path.length) : path;
        return base + '/' + path;
    }
}