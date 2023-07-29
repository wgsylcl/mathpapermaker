const { ipcRenderer } = require('electron')

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
    choices: [document.choice.E, document.choice.A, document.choice.B, document.choice.C, document.choice.D],
    subtasks: [
        {
            mainEdit: document.getElementById('subtask0main'),
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask0'),
                document.getElementById('sub2subtask0')
            ]
        },
        {
            mainEdit: document.getElementById('subtask1main'),
            cnt: document.subtask1.cnt,
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask1'),
                document.getElementById('sub2subtask1')
            ]
        },
        {
            mainEdit: document.getElementById('subtask2main'),
            cnt: document.subtask2.cnt,
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask2'),
                document.getElementById('sub2subtask2')
            ]
        },
        {
            mainEdit: document.getElementById('subtask3main'),
            cnt: document.subtask3.cnt,
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask3'),
                document.getElementById('sub2subtask3')
            ]
        },
        {
            mainEdit: document.getElementById('subtask4main'),
            cnt: document.subtask4.cnt,
            subtasks: [
                document.getElementById('empty'),
                document.getElementById('sub1subtask4'),
                document.getElementById('sub2subtask4')
            ]
        }
    ]
}

function openfile() {
    console.log('Call function openfile!')
}

function createfile() {
    console.log('Call function createfile!')
    paper = base_paper
    page = 1
    loadpage()
}

function savefile() {
    console.log('Call function savefile!')
}

function exportfile() {
    console.log('Call function exportfile!')
}

function loadpage() {
    var task = paper.tasks.at(page)
    htmledit.warningEdit.style.display = 'none'
    htmledit.choicediv.style.display = 'none'
    htmledit.subtaskdiv.style.display = 'none'
    htmledit.maindiv.style.display = 'block'
    htmledit.guidediv.style.display = 'block'
    htmledit.headdiv.style.display = 'block'
    htmledit.lastpageButton.style.display = 'block'
    htmledit.nextpageButton.style.display = 'block'
    if(page <= 1)
    htmledit.lastpageButton.style.display = 'none'
    if(page >= 24)
    htmledit.nextpageButton.style.display = 'none'
    var types = ['未知','选择','填空','解答']
    htmledit.pageEdit.innerHTML = '第'+page+'题，共24题，本题是'+types[task.type]+'题。'
    for (var i = 1; i <= 4; i++) {
        var subtaskEdit = htmledit.subtasks[i]
        subtaskEdit.mainEdit.style.display = 'none'
        for (var j = 1; j <= 2; j++) {
            var subsubtaskEdit = subtaskEdit.subtasks[j]
            subsubtaskEdit.style.display = 'none'
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
                subtaskEdit.mainEdit.value = subtask.mainEdit
                var subsubtaskcnt = subtask.cnt
                subtaskEdit.cnt[subsubtaskcnt].checked = true
                for(var j = 1; j <= subsubtaskcnt; j++) {
                    var subsubtaskEdit = subtaskEdit.subtasks[j]
                    subsubtaskEdit.value = subtask.subtasks[j]
                    subsubtaskEdit.style.display = 'block'
                }
            }
            break;
    }
}

function topage(newpage)
{
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
}

function setpaperinformation() {
    paper.information = document.paper.information
    console.log('change the information of paper to ' + document.paper.information.value)
}

function settext() {
    edit = document.getElementById('mainEdit')
    paper.tasks[page].text = edit.value
}

function setchoice(name) {
    edit = document.getElementsByName(name)
    paper.tasks[page].choices[choicemap.get(name)] = edit.value
}

function setchoicetype(type) {
    paper.tasks[page].choicetype = type
}
