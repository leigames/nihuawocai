function randomNum(Min, Max) {
    var num = Min + Math.round(Math.random() * (Max - Min));
    return num;
}

function changeNumMode() {
    use_namelist = document.getElementById("use_namelist").checked;
    if (use_namelist) {
        document.getElementById("num_input").style.display = "none";
        document.getElementById("namelist_input").style.display = "block";
    } else {
        document.getElementById("num_input").style.display = "block";
        document.getElementById("namelist_input").style.display = "none";
    }
    updateLengthSelect()
}

function getNameList() {
    use_namelist = document.getElementById("use_namelist").checked;
    if (!use_namelist) return;
    namelist = document.getElementById("namelist").value.replace(/^\s+|\s+$/g, "").replace(/\n\s+/g, "\n").split("\n");
    return namelist;
}

function getNumOfPlayers() {
    use_namelist = document.getElementById("use_namelist").checked;
    if (use_namelist) {
        return getNameList().length;
    }
    return Number(document.getElementById("num_select").value);
}

function updateLengthSelect() {
    length_select = document.getElementById("length_select");
    // reset
    length_select.innerHTML = "";

    num = getNumOfPlayers();

    // if num < 6 or num > 16, disable the showSeq button
    if (num < 6 || num > 16) {
        document.getElementById("showSeq").disabled = true;
    } else {
        document.getElementById("showSeq").disabled = false;
    }

    // add options
    for (var i = 6; i <= num; i += 2) {
        length_select.innerHTML += "<option value=\"" + i + "\">" + i + " 人</option>";
    }
    length_select.value = String((num % 2 == 0) ? num : num - 1);
}

function showSeq() {
    num = getNumOfPlayers();
    length = Number(document.getElementById("length_select").value);
    var init = [];
    var outputsort = [];
    var rand_map = [];
    for (var i = 0; i < num; i++) {
        init[i] = randomNum(1, num);
        for (var j = 0; j < i; j++) {
            if (init[i] == init[j]) {
                i--;
                break;
            }
        }
    }
    for (var i = 0; i < num; i++) {
        outputsort[i] = randomNum(1, num);
        for (var j = 0; j < i; j++) {
            if (outputsort[i] == outputsort[j]) {
                i--;
                break;
            }
        }
    }
    for (var i = 0; i < num; i++) {
        rand_map[i] = randomNum(1, num);
        for (var j = 0; j < i; j++) {
            if (rand_map[i] == rand_map[j]) {
                i--;
                break;
            }
        }
    }
    var move_vector = [];
    for (var i = 0; i < num; i = i + 2) {
        move_vector[i] = i / 2 + 1;
        move_vector[i + 1] = num + 1 - move_vector[i];
    }
    var res_array = new Array();
    // console.log(JSON.stringify(move_vector));
    // console.log(JSON.stringify(init));
    // console.log(JSON.stringify(outputsort));
    // initialize
    for (var i = 0; i < num; i++) {
        res_array[i] = new Array();
        for (var j = 0; j < num; j++) {
            res_array[i][j] = 0;
        }
    }
    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            res_array[outputsort[j] - 1][i] = (init[j] + move_vector[i]) % num;
        }
    }
    // console.log(JSON.stringify(res_array));
    ret = document.getElementById("output");
    ret.innerHTML = "<ol id='result'></ol>";
    res = document.getElementById("result");
    // n = document.getElementById("no");
    // n.innerHTML = "";

    // Random layer
    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            res_array[i][j] = rand_map[res_array[i][j]];
        }
    }
    sort = document.getElementById("sort").checked;
    use_namelist = document.getElementById("use_namelist").checked;

    if (sort) {
        res_array.sort(function(a, b) {
            return a[0] - b[0];
        });
    }
    console.log(JSON.stringify(res_array));

    if (use_namelist) {
        namelist = getNameList();
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < num; j++) {
                res_array[i][j] = "\"" + namelist[res_array[i][j] - 1] + "\"";
            }
        }
    }

    for (var i = 0; i < num; i++) {
        let tmp_str = "";
        tmp_str += "<li>";
        for (var j = 0; j < length; j++) {
            tmp_str += res_array[i][j];
            tmp_str += (j == length - 1) ? "" : ",";
        }
        tmp_str.innerHTML += "</li>"
        res.innerHTML += tmp_str;
    }
}
/*for (var i = 0; i < num; i++) {
    n.innerHTML += "[" + (i + 1) + "]<br>"
}*/


function reset() {
    ret = document.getElementById("output");
    // n = document.getElementById("no");
    ret.innerHTML = "生成的序列将显示在这里";
    // n.innerHTML = "";
}