const { dialog } = require('@electron/remote')
const fs = require('fs')
const { ipcRenderer } = require('electron')
const path = require('path')

const htmledit = {
    warningEdit: document.getElementById('warningEdit'),
    headdiv: document.getElementById('headdiv'),
    guidediv: document.getElementById('guidediv'),
    maindiv: document.getElementById('maindiv'),
    choicediv: document.getElementById('choicediv'),
    subtaskdiv: document.getElementById('subtaskdiv'),
    mainEdit: document.getElementById('mainEdit'),
    lastpageButton: document.getElementById('lastTaskButton'),
    nextpageButton: document.getElementById('nextTaskButton'),
    pageEdit: document.getElementById('pageEdit'),
    titleEdit: document.paper.title,
    informationEdit: document.paper.information,
    choices: [document.choice.E, document.choice.A, document.choice.B, document.choice.C, document.choice.D],
    subtasks: [
        {
            div: document.getElementById('subtask0'),
            mainEdit: document.getElementById('subtask0main'),
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask0'),
                document.getElementById('sub2subtask0')
            ],
            subtaskdivs: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask0div'),
                document.getElementById('sub2subtask0div')
            ]
        },
        {
            div: document.getElementById('subtask1'),
            mainEdit: document.getElementById('subtask1main'),
            cnt: document.subtask1.cnt,
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask1'),
                document.getElementById('sub2subtask1')
            ],
            subtaskdivs: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask1div'),
                document.getElementById('sub2subtask1div')
            ]
        },
        {
            div: document.getElementById('subtask2'),
            mainEdit: document.getElementById('subtask2main'),
            cnt: document.subtask2.cnt,
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask2'),
                document.getElementById('sub2subtask2')
            ],
            subtaskdivs: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask2div'),
                document.getElementById('sub2subtask2div')
            ]
        },
        {
            div: document.getElementById('subtask3'),
            mainEdit: document.getElementById('subtask3main'),
            cnt: document.subtask3.cnt,
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask3'),
                document.getElementById('sub2subtask3')
            ],
            subtaskdivs: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask3div'),
                document.getElementById('sub2subtask3div')
            ]
        },
        {
            div: document.getElementById('subtask4'),
            mainEdit: document.getElementById('subtask4main'),
            cnt: document.subtask4.cnt,
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask4'),
                document.getElementById('sub2subtask4')
            ],
            subtaskdivs: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask4div'),
                document.getElementById('sub2subtask4div')
            ]
        }
    ]
}

var saved = true
var filepath = ''
var filename = '未命名.paper'
var created = false

function openfile() {
    console.log('Call function openfile!')
    if(savefile() == false) return
    var ret = dialog.showOpenDialogSync({
        filters: [
            { name: '试卷配置文件', extensions: ['paper'] }
        ],
        title: '打开配置文件',
        properties: ['openFile']
    })
    if (typeof (ret) == 'undefined') {
        return
    }
    var jsondata = fs.readFileSync(ret[0], 'utf-8', () => { })
    console.log(jsondata)
    try {
        var papertemp = JSON.parse(jsondata)
    } catch (error) {
        dialog.showErrorBox('解析失败', '解析失败，配置文件可能已经损坏！（error：' + error.message + '）')
        return
    }
    paper = papertemp
    filepath = ret[0]
    filename = path.basename(filepath)
    ipcRenderer.send('settitle', filename)
    htmledit.titleEdit.value = paper.title
    htmledit.informationEdit.value = paper.information
    created = false
    saved = true
    page = 1
    loadpage()
}

function createfile() {
    console.log('Call function createfile!')
    if(savefile() == false) return
    paper = base_paper
    page = 1
    created = true
    saved = false
    filepath = ''
    filename = 'untitled.paper'
    htmledit.titleEdit.value = paper.title
    htmledit.informationEdit.value = paper.information
    ipcRenderer.send('settitle', filename + '*')
    loadpage()
}

function savefile() {
    console.log('Call function savefile!')
    if (saved) return
    if (created) {
        console.log('need save!')
        var ret = dialog.showSaveDialogSync({
            title: '保存文件',
            filters: [
                { name: '试卷配置文件', extensions: ['paper'] }
            ],
            defaultPath: ':/untitled.paper'
        })
        if (typeof (ret) == 'undefined') {
            return false
        }
        filepath = ret
        filename = path.basename(filepath)
        created = false
    }
    saved = true
    fs.writeFile(filepath, JSON.stringify(paper), () => { })
    console.log(filename)
    ipcRenderer.send('settitle', filename)
    return true
}


function loadpage() {
    var task = paper.tasks.at(page)
    htmledit.warningEdit.style.display = 'none'
    htmledit.choicediv.style.display = 'none'
    htmledit.subtaskdiv.style.display = 'none'
    htmledit.maindiv.style.display = 'block'
    htmledit.guidediv.style.display = 'flex'
    htmledit.headdiv.style.display = 'block'
    htmledit.lastpageButton.style.display = 'block'
    htmledit.nextpageButton.style.display = 'block'
    if (page <= 1)
        htmledit.lastpageButton.style.display = 'none'
    if (page >= 24)
        htmledit.nextpageButton.style.display = 'none'
    var types = ['未知', '选择', '填空', '解答']
    htmledit.pageEdit.innerHTML = '第' + page + '题，共24题，本题是' + types[task.type] + '题。'
    for (var i = 1; i <= 4; i++) {
        var subtaskEdit = htmledit.subtasks[i]
        subtaskEdit.value = ''
        subtaskEdit.div.style.display = 'none'
        for (var j = 1; j <= 2; j++) {
            var subsubtaskEdit = subtaskEdit.subtasks[j]
            subsubtaskEdit.value = ''
            var subsubtaskdiv = subtaskEdit.subtaskdivs[j]
            subsubtaskdiv.style.display = 'none'
        }
    }
    htmledit.mainEdit.value = task.text
    switch (task.type) {
        case selecting:
            htmledit.choicediv.style.display = 'block'
            document.choice.type[task.choicetype - 1].checked = true
            for (var i = 1; i <= 4; i++) {
                htmledit.choices[i].value = task.choices[i]
            }
            break;

        case answering:
            htmledit.subtaskdiv.style.display = 'block'
            var subtaskcnt = task.subtaskcnt
            document.subtask.cnt[subtaskcnt].checked = true
            for (var i = 1; i <= subtaskcnt; i++) {
                var subtask = task.subtasks[i]
                var subtaskEdit = htmledit.subtasks[i]
                subtaskEdit.div.style.display = 'block'
                subtaskEdit.mainEdit.value = subtask.text
                var subsubtaskcnt = subtask.subtaskcnt
                subtaskEdit.cnt[subsubtaskcnt].checked = true
                for (var j = 1; j <= subsubtaskcnt; j++) {
                    var subsubtaskEdit = subtaskEdit.subtasks[j]
                    var subsubtaskdiv = subtaskEdit.subtaskdivs[j]
                    subsubtaskEdit.value = subtask.subtasks[j]
                    subsubtaskdiv.style.display = 'block'
                }
            }
            break;
    }
}

function topage(newpage) {
    page = newpage
    loadpage()
}

ipcRenderer.on('open', openfile)

ipcRenderer.on('create', createfile)

ipcRenderer.on('save', savefile)

ipcRenderer.on('export', exportfile)

const selecting = 1
const compliting = 2
const answering = 3

const onp = 1
const twp = 2
const fop = 3

const base_paper = {
    title: '未命名试卷',
    information: '时间：2小时~~~满分：120分',
    tasks: [
        {},
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: selecting,
            text: '',
            choicetype: onp,
            choices: ['', '', '', '', '']
        },
        {
            type: compliting,
            text: '',
        },
        {
            type: compliting,
            text: '',
        },
        {
            type: compliting,
            text: '',
        },
        {
            type: compliting,
            text: '',
        },
        {
            type: compliting,
            text: '',
        },
        {
            type: compliting,
            text: '',
        },
        {
            type: answering,
            text: '',
            subtaskcnt: 0,
            subtasks: [
                {

                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                }
            ]
        },
        {
            type: answering,
            text: '',
            subtaskcnt: 0,
            subtasks: [
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                }
            ]
        },
        {
            type: answering,
            text: '',
            subtaskcnt: 0,
            subtasks: [
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                }
            ]
        },
        {
            type: answering,
            text: '',
            subtaskcnt: 0,
            subtasks: [
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                }
            ]
        },
        {
            type: answering,
            text: '',
            subtaskcnt: 0,
            subtasks: [
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                }
            ]
        },
        {
            type: answering,
            text: '',
            subtaskcnt: 0,
            subtasks: [
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                }
            ]
        },
        {
            type: answering,
            text: '',
            subtaskcnt: 0,
            subtasks: [
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                }
            ]
        },
        {
            type: answering,
            text: '',
            subtaskcnt: 0,
            subtasks: [
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                },
                {
                    text: '',
                    subtaskcnt: 0,
                    subtasks: ['', '', '']
                }
            ]
        }
    ]
}

const choicemap = new Map()

choicemap.set('A', 1)
choicemap.set('B', 2)
choicemap.set('C', 3)
choicemap.set('D', 4)

let paper = base_paper
let page = 0

function setpapertitle() {
    paper.title = document.paper.title.value
    console.log('change the title of paper to ' + document.paper.title.value)
    ipcRenderer.send('settitle',filename+'*')
    saved = false
}

function setpaperinformation() {
    paper.information = document.paper.information
    console.log('change the information of paper to ' + document.paper.information.value)
    ipcRenderer.send('settitle',filename+'*')
    saved = false
}

function settext() {
    edit = htmledit.mainEdit
    paper.tasks[page].text = edit.value
    ipcRenderer.send('settitle',filename+'*')
    saved = false
}

function setchoice(name) {
    edit = htmledit.choices[name]
    paper.tasks[page].choices[name] = edit.value
    ipcRenderer.send('settitle',filename+'*')
    saved = false
}

function setchoicetype(type) {
    paper.tasks[page].choicetype = type
    ipcRenderer.send('settitle',filename+'*')
    saved = false
}

function setsubtaskcnt(num) {
    saved = false
    ipcRenderer.send('settitle',filename+'*')
    var task = paper.tasks[page]
    task.subtaskcnt = num
    for (var i=1;i<=4;i++)
    {
        htmledit.subtasks[i].div.style.display = 'none'
        for(var j=1;j<=2;j++)
        htmledit.subtasks[i].subtaskdivs[j].style.display = 'none'
    }
    for (var i = 1; i <= num; i++) {
        var subtask = task.subtasks[i]
        var subtaskEdit = htmledit.subtasks[i]
        subtaskEdit.mainEdit.value = subtask.text
        subtaskEdit.div.style.display = 'block'
        var subsubtaskcnt = subtask.subtaskcnt
        subtaskEdit.cnt[subsubtaskcnt].checked = true
        for (var j = 1; j <= subsubtaskcnt; j++) {
            var subsubtaskEdit = subtaskEdit.subtasks[j]
            var subsubtaskdiv = subtaskEdit.subtaskdivs[j]
            subsubtaskEdit.value = subtask.subtasks[j]
            subsubtaskdiv.style.display = 'block'
        }
    }
}

function setsubsubtaskcnt(taskid, num) {
    saved = false
    ipcRenderer.send('settitle',filename+'*')
    var task = paper.tasks[page]
    var subtask = task.subtasks[taskid]
    subtask.subtaskcnt = num
    var taskEdit = htmledit.subtasks[taskid]
    for (var i = 1; i <= 2; i++) {
        taskEdit.subtaskdivs[i].style.display = 'none'
    }
    for (var i = 1; i <= num; i++) {
        taskEdit.subtaskdivs[i].style.display = 'block'
    }
}

function setsubtasktext(taskid) {
    saved = false
    ipcRenderer.send('settitle',filename+'*')
    var task = paper.tasks[page]
    var subtask = task.subtasks[taskid]
    var subtaskEdit = htmledit.subtasks[taskid]
    subtask.text = subtaskEdit.mainEdit.value
}

function setsubsubtasktext(subtaskid, subsubtaskid) {
    ipcRenderer.send('settitle',filename+'*')
    saved = false
    var subsubtaskEdit = htmledit.subtasks[subtaskid].subtasks[subsubtaskid]
    console.log(typeof (paper.tasks[page].subtasks[subtaskid].subtasks[subsubtaskid]))
    paper.tasks[page].subtasks[subtaskid].subtasks[subsubtaskid] = subsubtaskEdit.value
}

var base_tex = ''
var mathpaper_sty = ''
var basicmathpaper_sty = ''
var mathpicture_sty = ''

base_tex = fs.readFileSync('./resources/app/base.tex', 'utf-8', () => { })
mathpaper_sty = fs.readFileSync('./resources/app/mathpaper.sty', 'utf-8', () => { })
basicmathpaper_sty = fs.readFileSync('./resources/app/basicmathpaper.sty', 'utf-8', () => { })
mathpicture_sty = fs.readFileSync('./resources/app/mathpicture.sty', 'utf-8', () => { })

function exportfile() {
    console.log('Call function exportfile!')
    var savedir = dialog.showOpenDialogSync({
        properties: ['openDirectory'],
        title: '保存Latex项目'
    })
    if (typeof (savedir) == 'undefined')
        return
    fs.writeFileSync(path.join(savedir[0], 'mathpaper.sty'), mathpaper_sty)
    fs.writeFileSync(path.join(savedir[0], 'mathpicture.sty'), mathpicture_sty)
    fs.writeFileSync(path.join(savedir[0], 'basicmathpaper.sty'), basicmathpaper_sty)
    fs.writeFileSync(path.join(savedir[0], 'main.tex'), linktex())
}

function linktex() {
    var ret = base_tex
    var code = ''
    code += ('\\papertitle{' + paper.title + '}\n')
    ret += code
    code = ''
    code += ('\\paperinformation{' + paper.information + '}\n')
    ret += code
    code = ''
    ret += '\\informationline\n'
    ret += '\\begin{questions}{\\selectingintroduction}\n'
    for (var i = 1; i <= 10; i++) {
        code = '    \\question '
        var task = paper.tasks[i]
        code += task.text
        code += '\n'
        ret += code
        code = '    '
        switch (task.choicetype) {
            case onp:
                code += '\\onp'
                break

            case twp:
                code += '\\twp'
                break

            case fop:
                code += '\\fop'
                break
        }
        for (var j = 1; j <= 4; j++) {
            code += '{'
            code += task.choices[j]
            code += '}'
        }
        code += '\n'
        ret += code
    }
    ret += '\\end{questions}\n\n'
    ret += '\\begin{questions}{\\complitingintroduction}\n'
    for (var i = 11; i <= 16; i++) {
        var task = paper.tasks[i]
        code = '    \\question '
        code += task.text
        code += '\n'
        ret += code
    }
    ret += '\\end{questions}\n\n'
    ret += '\\begin{questions}{\\answeringintroduction}\n'
    for (var i = 17; i <= 24; i++) {
        code = '    \\question '
        var task = paper.tasks[i]
        code += task.text
        code += '\n'
        code += linksubtask(task)
        ret += code
    }
    ret += '\\end{questions}\n\n'
    ret += '\\end{document}\n'
    return ret
}

function linksubtask(task) {
    var ret = '', code = ''
    if (task.subtaskcnt == 0) return ''
    ret += '    \\begin{subquestions}\n'
    for (var i = 1; i <= task.subtaskcnt; i++) {
        code = '        \\subquestion '
        var subtask = task.subtasks[i]
        code += subtask.text
        code += '\n'
        code += linksubsubtask(subtask)
        ret += code
    }
    ret += '    \\end{subquestions}\n'
    return ret
}

function linksubsubtask(task) {
    if (task.subtaskcnt == 0) return ''
    var code = '', ret = ''
    ret += '        \\begin{subsubquestions}\n'
    for (var i = 1; i <= task.subtaskcnt; i++) {
        code = '            \\subsubquestion '
        code += task.subtasks[i]
        code += '\n'
        ret += code
    }
    ret += '        \\end{subsubquestions}\n'
    return ret
}