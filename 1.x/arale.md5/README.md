Overview
========

此模块提供md5加密功能。

Usage
=====

    hex_md5('yourpassword')  //16进制md5加密
    b64_md5('yourpassword')  //Base64编码加密


Methods
=======

*   hex_md5(s) - 返回16进制md5加密结果。平时主要使用这个函数。

*   b64_md5(s) - 返回Base64编码md5加密结果。

*   any_md5(s, e)

*   hex_hmac_md5(k, d)

*   b64_hmac_md5(k, d)

*   any_hmac_md5(k, d, e)
