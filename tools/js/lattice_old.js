let color_value = "#000000";
let history_colors = ["#000000"];

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
        history_colors = history_colors.slice(0,8);
    }

    // 然后，更新所有的history
    history_tiles = document.getElementsByClassName('history');

    for (i in history_colors) {
        history_tiles[i].style.backgroundColor = history_colors[i];
    }
}

function getHistoryColor(id) {
    // 先获得序数
    index = Number(id.split('-')[1]);
    if (index >= history_colors.length) {
        return "#FFFFFF";
    }
    return history_colors[index];
}
