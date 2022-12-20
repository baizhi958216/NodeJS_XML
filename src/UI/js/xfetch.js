// 要求要用到ajax, 用XHR封装一个类似fetch的模块
/**
 * 
 * @param {接口地址} url 
 * @param {method,header,body} data 
 * @param {成功的回调函数} success 
 * @param {失败的回调函数} fail 
 */
function ajax(url, data, success, fail) {
    const xhr = new XMLHttpRequest()
    if (data && data.method) {
        xhr.open(data.method, url, true)
        xhr.setRequestHeader('Content-Type', data.header.get('Content-Type'))
    } else {
        xhr.open('GET', url, true)
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(xhr)
            } else {
                fail(xhr.responseText)
            }
        }
    }
    if (data) {
        xhr.send(data.body)
    } else {
        xhr.send(null)
    }
}

// 据了解, fetch返回的也是一个Promise
/**
 * 
 * @param {地址} url 
 * @param {目前只实现了method,header,body} data 
 * @returns 
 */
function xfetch(url, data) {
    return new Promise((resolve, reject) => {
        ajax(url, data, res => resolve(res), err => reject(err))
    })
}

export { xfetch }