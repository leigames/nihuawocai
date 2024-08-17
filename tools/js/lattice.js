let color_value = "#000000";
let comm_link = window.location.protocol + "//" + window.location.host + window.location.pathname;
let history_colors = [color_value, "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
if (localStorage.getItem("HistoryColor") != null) {
    history_colors = JSON.parse(localStorage.getItem("HistoryColor"));
}
getQuery();
initializeHistoryColors();

function initializeHistoryColors() {
    history_tiles = document.getElementsByClassName('history');

    for (var i = 0; i < history_tiles.length; i++) {
        history_tiles[i].innerHTML = "";
        if (i < history_colors.length) {
            // console.log(111);
            history_tiles[i].style.backgroundColor = history_colors[i];
        } else {
            history_tiles[i].style.backgroundColor = "#FFFFFF";
        }
    }
}

function copyToClipboard(textToCopy) {
    // navigator clipboard 需要https等安全上下文
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // 创建text area
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var cells = document.getElementsByTagName('td');

    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('touchstart', function() {
            this.style.backgroundColor = color_value;
        });

        cells[i].addEventListener('touchend', function() {
            this.style.backgroundColor = color_value;
        });

        cells[i].addEventListener('touchmove', function(event) {
            event.preventDefault();
            var touch = event.touches[0];
            var target = document.elementFromPoint(touch.clientX, touch.clientY);

            if (target.tagName === 'TD') {
                target.style.backgroundColor = color_value;
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    var cells = document.getElementsByTagName('td');
    var isMouseDown = false;
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('mousedown', function() {
            isMouseDown = true;
            this.style.backgroundColor = color_value;
        });

        cells[i].addEventListener('mouseup', function() {
            isMouseDown = false;
        });

        cells[i].addEventListener('mouseover', function() {
            if (isMouseDown) {
                this.style.backgroundColor = color_value;
            }
        });
    }

    document.addEventListener('mouseup', function() {
        isMouseDown = false;
    });
});

/*
function choosecolor(r,g,b){
	red=r;
	green=g;
	blue=b;
}

function choosecolor_free(){
	red=document.getElementById("r").value;
	green=document.getElementById("g").value;
	blue=document.getElementById("b").value;
}
*/

function chooseColor(set_color_value) {
    // 改变当前的颜色值
    color_value = set_color_value;

    // 改变panel的颜色值
    panel = document.getElementById("panel");
    panel.value = set_color_value;

    // 改变历史颜色值
    setHistoryColor(set_color_value);
}

function setHistoryColor(new_color) {
    // 先插入新的颜色
    // 有相同的颜色就不执行
    if (history_colors.indexOf(new_color) == -1) { // 不存在
        history_colors.unshift(new_color);
    }

    // 如果history colors过多，只保留前8个
    if (history_colors.length > 8) {
        history_colors = history_colors.slice(0, 8);
    }

    // 然后，更新所有的history
    history_tiles = document.getElementsByClassName('history');

    for (var i = 0; i < history_tiles.length; i++) {
        if (i < history_colors.length) {
            history_tiles[i].style.backgroundColor = history_colors[i];
        } else {
            history_tiles[i].style.backgroundColor = "#FFFFFF";
        }
    }

    localStorage.setItem("HistoryColor", JSON.stringify(history_colors));
}

function getHistoryColor(id) {
    // 先获得序数
    index = Number(id.split('-')[1]);
    if (index >= history_colors.length) {
        return "#FFFFFF";
    }
    return history_colors[index];
}

function rgbToHex(rgb) {
    if (rgb == "") {
        return "#FFFFFF";
    }
    let arr = rgb
        .replace("rgb", "")
        .replace("(", "")
        .replace(")", "")
        .split(",");
    // 转十六进制，没有#开头
    return "#" + (('0' + (+arr[0]).toString(16)).slice(-2) + ('0' + (+arr[1]).toString(16)).slice(-2) + ('0' + (+arr[2]).toString(16)).slice(-2)).toUpperCase();
}

function positionToHex(position) {
    // 把传入的位置改为十六进制字符串
    return ('0' + position.toString(16)).slice(-2);
}

// 以url+base64格式导出颜色参数
function exportColor() {
    return exportColorSimplified();
    var cells = document.getElementsByTagName('td');
    var color_list = [];
    for (var i = 0; i < cells.length; i++) {
        color_list.push(rgbToHex(cells[i].style.backgroundColor));
    }
    json_str = JSON.stringify(color_list);
    console.log(json_str)
    return encodeURI(btoa(json_str));
}

// 缩短长度
function exportColorSimplified() {
    var cells = document.getElementsByTagName('td');

    var color_list = [];
    for (var i = 0; i < cells.length; i++) {
        color_list.push(rgbToHex(cells[i].style.backgroundColor));
    }

    // 获得所有已有颜色
    var existing_colors = Array.from(new Set(color_list));
    console.log(existing_colors)

    // 获得它们的位置
    let indices = [];

    for (var j = 0; j < existing_colors.length; j++) {
        // 这是所有 existing_colors[j] 的位置
        let index_arr_j = [];
        let index = color_list.indexOf(existing_colors[j]);
        let order = 0;
        while (index > -1) {
            // 递归寻找所有位置
            order++;
            index_arr_j.push(positionToHex(index));
            index = color_list.indexOf(existing_colors[j], index + 1);
        }
        indices[existing_colors[j]] = { "members": index_arr_j, "order": order };
    }

    // 按 order 排序
    keys = existing_colors.sort((a, b) => { return -indices[a].order + indices[b].order });
    console.log(keys)
    indices[keys[0]].members = ["*"];

    console.log(indices)

    // 手写输出
    // 按 keys 来
    let output = "";
    for (var k = 0; k < keys.length; k++) {
        output += (keys[k] + "=" + indices[keys[k]].members.join(''));
    }
    console.log(output)
    console.log(encodeURI(output))
    console.log(encodeURI(btoa(output)))

    return "val=" + encodeURI(btoa(output));
}

// 读取参数
function getQuery() {
    var cells = document.getElementsByTagName('td');
    var url = location.search; //获取url中"?"符后的字串
    if (url.indexOf("?") != -1) {
        var str = url.split("?")[1];
        if (str.includes("val=")) {
            str = str.slice(4, str.length);
            console.log(str);
            var query = atob(decodeURI(str));
            getQueryInfoSimplified(query, cells);
        } else {
            var query = atob(decodeURI(str));
            var color_list = JSON.parse(query);
            for (var i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = color_list[i];
            }
        }
        // 有参数就生成图片
        captureTable();
    }
}

function getQueryInfoSimplified(query, cells = document.getElementsByTagName('td')) {
    // 读取query里的位置信息，query例子：（实际无换行）
    // #FFFFFF=*
    // #000000=18191a25262a3234353a434a52535a6263697273747984858688969798999aab
    // #00FF00=4e5e6ea2b2b3babec3c9cacbcdced4d5d6d7d8dbdcddec
    // #FF00FF=1c2c3c4c5c6c7c7da3a4a5b5b6c1d1d2e2e3e4f5f6
    // #0000FF=47485657656675

    // 先按#拆分
    let str_by_color = query.split("#");
    str_by_color.shift();

    // console.log(str_by_color);

    // 对于按#拆分的每一个元素，里面再按=拆分，第0项是颜色，第1项是填充的位置
    // 填充的位置除非是*，按两位一读
    for (var i = 0; i < str_by_color.length; i++) {
        // console.log('yes')
        let pair = str_by_color[i].split("=");
        let color = "#" + pair[0];
        let positions = pair[1];
        // 如果是*，直接填充所有格子
        if (positions == "*") {
            // console.log('yes1')
            for (var j = 0; j < cells.length; j++) {
                cells[j].style.backgroundColor = color;
            }
        }
        // 否则，按2位分割并转为10进制
        else {
            while (positions) {
                // console.log('yes2')
                let this_cell = eval("0x" + positions.slice(0, 2));
                // console.log(this_cell);
                cells[this_cell].style.backgroundColor = color;
                positions = positions.slice(2, positions.length);
            }
        }
    }
}

/*
// 编码压缩
function string16to64(num_16) {
    number = eval("0x" + num_16);
    var chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~'.split(''),
        radix = chars.length, // 64
        qutient = +number,
        arr = [];
    do {
        mod = qutient % radix;
        qutient = (qutient - mod) / radix;
        arr.unshift(chars[mod]);
    } while (qutient);
    return arr.join('');
}

// 解码
function string64to16(num_64) {
    var chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~'.split(''),
        radix = chars.length, // 64
        res = 0;

    var digit_64 = num_64.length;

    for (var i = digit_64 - 1, j = 1; i >= 0; i--, j *= radix) {
        res += chars.indexOf(num_64[i]) * j;
    }

    return res.toString(16);
}
*/

function show_link() {
    let link = comm_link + "?" + exportColor();
    copyToClipboard(link);
    $("#link-to-this-alert").slideDown(200);
}

function hide_link() {
    $("#link-to-this-alert").slideUp(200);
}

function captureTable() {
    // 表格去除边框
    var cells = document.getElementsByTagName('td');
    for (var i = 0; i < cells.length; i++) {
        cells[i].style.border = "none";
    }

    $("#tip").slideDown(200);
    // navigator.clipboard.writeText(comm_link + "?" + exportColor());


    // 捕获表格为Canvas  
    html2canvas(document.getElementById('lattice')).then(canvasTable => {
        // 创建一个新的Canvas，足够大以容纳表格和二维码  
        var combinedCanvas = document.createElement('canvas');
        var ctx = combinedCanvas.getContext('2d');
        combinedCanvas.width = 256;
        combinedCanvas.height = 256;
        // 将表格绘制到新的Canvas上  
        ctx.drawImage(canvasTable, 0, 0, combinedCanvas.width, combinedCanvas.height);


        /*
        // 设定新的Canvas的尺寸（这里只是示例，您需要根据实际情况调整）  
        var qrSize = 256; // 二维码大小  
        var tableWidth = canvasTable.width;
        var tableHeight = canvasTable.height;
        var combinedWidth = tableWidth;
        var combinedHeight = tableHeight + qrSize + 20; // 加上一些间距  

        combinedCanvas.width = combinedWidth;
        combinedCanvas.height = combinedHeight;

        // 生成二维码  
        var qrDiv = document.getElementById('qrcode');
        new QRCode(qrDiv, {
            text: "http://???/tools/lattice_painter.php?" + exportColor(), // 替换为您的链接  
            width: qrSize,
            height: qrSize
        });

        // 将二维码绘制到新的Canvas上（注意：QRCode库可能不直接支持绘制到Canvas，这里只是示意）  
        // 实际上，您可能需要使用其他库或手动绘制二维码  
        // 假设 qrcodeDiv.querySelector('canvas') 存在且是QRCode库生成的Canvas  


        var qrCanvas = qrDiv.querySelector('canvas');
        if (qrCanvas) {
            ctx.drawImage(qrCanvas, 0, tableHeight + 10); // 10为间距  
        }
        */

        // 将组合后的Canvas转换为图片并显示  
        var img = document.createElement('img');
        img.src = combinedCanvas.toDataURL();
        document.getElementById('output').innerHTML = "";
        document.getElementById('output').appendChild(img);
    });

    // 复原
    for (var i = 0; i < cells.length; i++) {
        cells[i].style.border = "1px solid black";
    }

    output_mode();
}

function save() {
    let link = comm_link + "?" + exportColor();

    copyToClipboard(link);

    Swal.fire({
        title: "保存成功",
        html: `<span style="color:green">作品链接已复制，请直接粘贴提交给主持人！</span><br><small>图片无需提交，您可自行存储。</small>`,
        icon: "success",
        confirmButtonText: '好的',
        allowOutsideClick: true
    }).then(function() {
        window.location.href = link;
    });
}

function reset() {
    var cells = document.getElementsByTagName('td');
    Swal.fire({
        title: "请选择重置内容",
        html: `<span style="color:red">重置操作目前无法撤销！</span>`,
        icon: "info",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '重置画布和历史颜色',
        denyButtonText: '仅重置画布',
        cancelButtonText: '取消',
        reverseButtons: false,
        allowOutsideClick: true
    }).then(function(result) {
        if (result.isConfirmed) {
            for (var j = 0; j < cells.length; j++) {
                cells[j].style.backgroundColor = "#FFFFFF";
            }
            localStorage.removeItem("HistoryColor");
            history_colors = [color_value, "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"];
            initializeHistoryColors();
        } else if (result.isDenied) {
            for (var j = 0; j < cells.length; j++) {
                cells[j].style.backgroundColor = "#FFFFFF";
            }
        } else {
            return;
        }
    });
}

function cancel_editing() {
    Swal.fire({
        title: "您确定要取消编辑吗？",
        html: `<span style="color:red">这将退回到上次保存的内容（如未保存则为空画布）！</span><br><small>如希望恢复到更早保存的内容，可尝试回退页面。</small>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        reverseButtons: false,
        allowOutsideClick: true
    }).then(function(result) {
        if (result.isConfirmed) {
            window.location.href = location.href;
        }
    });
}

function edit() {
    $('#edit_mode').slideDown(200);
    $('#output_mode').slideUp(200);
}

function output_mode() {
    $('#edit_mode').hide();
    $('#output_mode').show();
    $("#link-to-this").html(location.href);
    $("#link-to-this").attr('href', location.href);
}