import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesUtilService {

  constructor(
    private http: HttpClient
  ) { }
  salt = CryptoJS.lib.WordArray.create(new Int8Array([-57, -75, -103, -12, 75, 124, -127, 119]));

  wordArray = CryptoJS.enc.Hex.parse('ad0a251cd4e748139473cef21c9676d1');
  wordArray2 = CryptoJS.enc.Hex.parse('f2677cd28ebfde8c589a9c82c52207fa');
  ivINT = this.wordArray;
  saltINT = this.wordArray2;

  keySize = 256;
  ivSize = 16;
  iterations = 65536;


  keySizeINT = 128;
  ivSizeINT = 16;
  iterationsINT = 100;

  pass = 'Subscripti0nP@SSphrase!';

  encrypt(msg, pass) {
    const key = CryptoJS.PBKDF2(pass, this.salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    });

    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    const transitmessage = iv + encrypted.ciphertext;
    const tm = CryptoJS.enc.Hex.parse(transitmessage);

    return CryptoJS.enc.Base64.stringify(tm);
  }

  decrypt(transitmessage, pass) {
    const str = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(transitmessage));
    const iv = CryptoJS.enc.Hex.parse(str.substr(0, 32));
    const encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(str.substring(32)));
    const key = CryptoJS.PBKDF2(pass, this.salt, {
      keySize: this.keySize / 32,
      iterations: this.iterations
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  internalEncrypt(msg) {
    const key = CryptoJS.PBKDF2(this.pass, this.saltINT, {
      keySizeINT: this.keySizeINT / 32,
      iterations: this.iterationsINT
    });

    const encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: this.ivINT,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  }

  internalDecrypt(encrypted) {

    const key = CryptoJS.PBKDF2(this.pass, this.saltINT, {
      keySizeINT: this.keySizeINT / 32,
      iterations: this.iterationsINT
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: this.ivINT,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);

  }

}
