import { xfetch } from "./xfetch.js"
import { $ } from "./xquery.js"

const LoginModal = new bootstrap.Modal($('#LoginModal'))
const RegisterModal = new bootstrap.Modal($('#RegisterModal'))
const userform = $('#userloginform')
const registerform = $('#registerform')
const adminform = $('#adminloginform')
const systemSwitch = document.querySelectorAll('.nav-link')
const registerButton = $('.registerbtn')
const locationselector = $('.locationselector')
const sexselector = $('.sexselector')
const birthdayselector = $('.birthdayselector')
let nowSystem = 'user'

// 导航栏Client/Server系统切换事件
systemSwitch.forEach(e => {
    e.addEventListener('click', click => {
        systemSwitch.forEach(e => e.className = 'nav-link')
        if (click.target.classList.length == 1) {
            click.target.className += ' active'
        } else {
            click.target.className = 'nav-link'
        }
        if (e.attributes["aria-current"].value == 'user') {
            nowSystem = 'user'
            $('.mainserver').style.display = 'none'
            $('.mainclient').style.display = 'block'
        } else if (e.attributes["aria-current"].value == 'admin') {
            nowSystem = 'admin'
            $('.mainclient').style.display = 'none'
            $('.mainserver').style.display = 'block'
        }
    })
})

// 导航栏注册按钮事件
registerButton.addEventListener('click', () => {
    if (nowSystem == 'user') {
        sexselector.className = 'mb-3 input-group flex-nowrap'
        locationselector.className = 'mb-3 input-group flex-nowrap'
        birthdayselector.className = 'mb-3 input-group flex-nowrap'
    } else {
        sexselector.classList += ' hidden'
        locationselector.classList += ' hidden'
        birthdayselector.classList += ' hidden'
    }
    RegisterModal.show()
})

// 注册模态框注册事件
registerform.addEventListener('submit', (e) => {
    e.preventDefault()
    const uname = e.target[0].value
    const upassword = e.target[1].value
    const ugender = e.target[2].value
    const ulocation = e.target[3].value
    const year = e.target[4].value
    const month = e.target[5].value
    const day = e.target[6].value
    if (nowSystem == 'user') {
        // 用户注册
        if (uname && upassword && ugender && ulocation && year && month && day) {
            xfetch('http://localhost:3000/userregister', {
                method: 'POST',
                header: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    uname: uname,
                    upassword: upassword,
                    ugender: ugender,
                    ulocation: ulocation,
                    ubirthday: `${year}-${month}-${day}`
                })
            }).then(res => JSON.parse(res.response)).then(data => {
                $('.login-body').innerHTML = `<p>${data.stats}</p>`
                if (data.code == 200) {
                    registerform.reset()
                    LoginModal.show()
                } else {
                    LoginModal.show()
                }
            })
        } else {
            $('.login-body').innerHTML = `<p>表单项不可为空</p>`
            // RegisterModal.hide()
            LoginModal.show()
        }
    } else {
        // 管理员注册
        if (uname && upassword) {
            xfetch('http://localhost:3000/adminregister', {
                method: 'POST',
                header: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    uname: uname,
                    upassword: upassword
                })
            }).then(res => JSON.parse(res.response)).then(data => {
                $('.login-body').innerHTML = `<p>${data.stats}</p>`
                if (data.code == 200) {
                    registerform.reset()
                    LoginModal.show()
                } else {
                    LoginModal.show()
                }
            })
        } else {
            $('.login-body').innerHTML = `<p>用户名和密码不可为空</p>`
            // RegisterModal.hide()
            LoginModal.show()
        }
    }
})

// 用户登录
userform.addEventListener("submit", function (event) {
    event.preventDefault()
    const account = event.target[0].value, password = event.target[1].value
    if (account && password) {
        xfetch('http://localhost:3000/userlogin', {
            method: 'POST',
            header: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                account: account,
                password: password
            })
        }).then(res => JSON.parse(res.response)).then(data => {
            if (data.code === 200) {
                $('.login-body').innerHTML = `<p>登录成功, 欢迎</p>`
            } else if (data.code === 400) {
                $('.login-body').innerHTML = `<p>登录失败, ${data.stats}</p>`
            } else if (data.code === 401) {
                $('.login-body').innerHTML = `<p>登录失败, ${data.stats}</p>`
            } else {
                $('.login-body').innerHTML = `<p>登录失败, 未知错误</p>`
            }
            LoginModal.show()
            if (data.code === 200) {
                userform.reset()
                setTimeout(() => {
                    window.location.href = data.url
                }, 2000)
            }
        })
    } else {
        $('.login-body').innerHTML = `<p>用户名和密码不可为空</p>`
        LoginModal.show()
    }
})

// 管理员登录
adminform.addEventListener("submit", function (event) {
    event.preventDefault()
    const account = event.target[0].value, password = event.target[1].value
    if (account && password) {
        xfetch('http://localhost:3000/adminlogin', {
            method: 'POST',
            header: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                account: account,
                password: password
            })
        }).then(res => JSON.parse(res.response)).then(data => {
            if (data.code === 200) {
                $('.login-body').innerHTML = `<p>登录成功, 你好${account}</p>`
            } else if (data.code === 400) {
                $('.login-body').innerHTML = `<p>登录失败, ${data.stats}</p>`
            } else if (data.code === 401) {
                $('.login-body').innerHTML = `<p>登录失败, ${data.stats}</p>`
            } else {
                $('.login-body').innerHTML = `<p>登录失败, 未知错误</p>`
            }
            LoginModal.show()
            if (data.code === 200) {
                adminform.reset()
                setTimeout(() => {
                    window.location.href = data.url
                }, 2000)
            }
        })
    } else {
        $('.login-body').innerHTML = `<p>管理员名和密码不可为空</p>`
        LoginModal.show()
    }
})