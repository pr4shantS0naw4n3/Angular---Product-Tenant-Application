import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    constructor() { }

    get userInfo() {
        return JSON.parse(localStorage.getItem('userInfo'))
    }

    set userInfo(userData: any) {
        localStorage.setItem('userInfo', JSON.stringify(userData))
    }
}