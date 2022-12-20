import { xfetch } from './xfetch.js'
import { $ } from './xquery.js'
const modifyPetModal = new bootstrap.Modal('#modifyPetModal')
const AddPetModal = new bootstrap.Modal('#AddPetModal')
const XPathModal = new bootstrap.Modal('#XPathModal')
const messageModal = new bootstrap.Modal('#messageModal')
const listener = () => {
    // 遍历表格每一行加入修改按钮
    document.querySelectorAll('tr').forEach((e, index) => {
        if (index != 0) {
            e.innerHTML += `<td><button class="btn btn-primary mdftd" pet-data="${e.children[0].textContent}">修改</button></td>`
        }
    })

    // 为每一行的修改按钮绑定点击事件
    document.querySelectorAll('.mdftd').forEach(e => {
        e.addEventListener('click', async e => {
            await xfetch('http://localhost:3000/GetPetByID', {
                method: 'POST',
                header: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    pid: e.originalTarget.attributes[1].nodeValue
                })
            }).then(res => JSON.parse(res.responseText)).then(data => {
                const { pid, pname, ptype, pbirthday } = data
                $('.modifyPetModal').innerHTML = ''
                $('.modifyPetModal').innerHTML = `
            <form class="w-75 mx-auto d-flex flex-column" id="modifyPetform">
              <div class="mb-3 input-group flex-nowrap">
                <span class="input-group-text" id="addon-wrapping">宠物ID</span>
                <input type="text" class="form-control" aria-label="pid" disabled value="${pid}" aria-describedby="addon-wrapping">
              </div>
              <div class="mb-3 input-group flex-nowrap">
                <span class="input-group-text" id="addon-wrapping">宠物名</span>
                <input type="text" class="form-control" aria-label="pname" value="${pname}" aria-describedby="addon-wrapping">
              </div>
              <div class="mb-3 input-group flex-nowrap">
                <span class="input-group-text" id="addon-wrapping">宠物种族</span>
                <input type="text" class="form-control" aria-label="ptype" value="${ptype}" aria-describedby="addon-wrapping">
              </div>
              <div class="mb-3 input-group flex-nowrap birthdayselector">
                <span class="input-group-text" id="addon-wrapping">出生日期</span>
                <input type="text" class="form-control" aria-label="year" value="${pbirthday.split('-')[0]}"  aria-describedby="addon-wrapping">
                <input type="text" class="form-control" aria-label="month" value="${pbirthday.split('-')[1]}" aria-describedby="addon-wrapping">
                <input type="text" class="form-control" aria-label="day" value="${pbirthday.split('-')[2]}" aria-describedby="addon-wrapping">
              </div>
            </form>
            `
                modifyPetModal.show()
                $('#modifyPetModal .modal-footer').style.display = 'flex'
            })
        })
    })
}

// 请求到所有宠物并加载到表格
function GetAllPets() {
    xfetch('http://localhost:3000/GetAllPets').then(res => {
        $('.xtbody').innerHTML = res.responseText
        listener()
    })
}
await GetAllPets()

// 新增
$('.addPet').addEventListener('click', (el) => {
    $('#addPetForm').reset()
    AddPetModal.show()
    $('#addPetForm').addEventListener('submit', async (e) => {
        e.preventDefault()
        await xfetch('http://localhost:3000/AddPet', {
            method: 'POST',
            header: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                pid: $('#addPetForm')[0].value,
                pname: $('#addPetForm')[1].value,
                ptype: $('#addPetForm')[2].value,
                pbirthday: `${$('#addPetForm')[3].value}-${$('#addPetForm')[4].value}-${$('#addPetForm')[5].value}`
            })
        }).then(res => {
            GetAllPets()
            AddPetModal.hide()
            $('.messageModal').innerHTML=JSON.parse(res.responseText).stats
            messageModal.show()
        })
    })
})

// 删除
$('#delb').addEventListener('click', (del) => {
    del.preventDefault()
    xfetch('http://localhost:3000/DeletePet', {
        method: 'POST',
        header: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            pid: $('.modifyPetModal').childNodes[1][0].value
        })
    }).then(res => {
        GetAllPets()
        $('.modifyPetModal').innerHTML = JSON.parse(res.responseText).stats
        $('#modifyPetModal .modal-footer').style.display = 'none'
    })
})

// 修改
$('#saveb').addEventListener('click', () => {
    xfetch('http://localhost:3000/ModifyPet', {
        method: 'POST',
        header: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            pid: $('.modifyPetModal').childNodes[1][0].value,
            pname: $('.modifyPetModal').childNodes[1][1].value,
            ptype: $('.modifyPetModal').childNodes[1][2].value,
            pbirthday: `${$('.modifyPetModal').childNodes[1][3].value}-${$('.modifyPetModal').childNodes[1][4].value}-${$('.modifyPetModal').childNodes[1][5].value}`
        })
    }).then(res => {
        GetAllPets()
        $('.modifyPetModal').innerHTML = JSON.parse(res.responseText).stats
        $('#modifyPetModal .modal-footer').style.display = 'none'
    })
})

// XPath查询
$('#XPathb').addEventListener('click', () => {
    xfetch(`http://localhost:3000/XPath/param?=${$('#XPath').value}`).then(res => {
        if (res.response == 'Failed') {
            $('.XPathModalBody').innerHTML = ''
            $('.XPathModalBody').innerText = '查询失败, 请检查输入'
            XPathModal.show()
        } else {
            $('.XPathModalBody').innerHTML = ''
            $('.XPathModalBody').innerText = `查询成功, \n${res.response}`
            XPathModal.show()
        }
    })
})

// Fuzzy查询
$('#Fuzzyb').addEventListener('click', () => {
    xfetch(`http://localhost:3000/Fuzzy/param?=${$('#Fuzzy').value}`).then(res => {
        $('.xtbody').innerHTML = res.response
        listener()
    })
})