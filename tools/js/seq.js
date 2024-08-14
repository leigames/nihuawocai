function random_num(Min, Max) {
    var num = Min + Math.round(Math.random() * (Max - Min));
    return num;
}

function show_seq() {
    num = Number(document.getElementById("num-select").value);
    var init = [];
    var outputsort = [];
    var rand_map = [];
    for (var i = 0; i < num; i++) {
        init[i] = random_num(1, num);
        for (var j = 0; j < i; j++) {
            if (init[i] == init[j]) {
                i--;
                break;
            }
        }
    }
    for (var i = 0; i < num; i++) {
        outputsort[i] = random_num(1, num);
        for (var j = 0; j < i; j++) {
            if (outputsort[i] == outputsort[j]) {
                i--;
                break;
            }
        }
    }
    for (var i = 0; i < num; i++) {
        rand_map[i] = random_num(1, num);
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
    console.log(JSON.stringify(move_vector));
    console.log(JSON.stringify(init));
    console.log(JSON.stringify(outputsort));
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
    console.log(JSON.stringify(res_array));
    ret = document.getElementById("output");
    n = document.getElementById("no");
    ret.innerHTML = "";
    n.innerHTML = "";
    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            ret.innerHTML += rand_map[res_array[i][j]] + " ";
        }
        ret.innerHTML += "<br>"
    }
    for (var i = 0; i < num; i++) {
        n.innerHTML += "[" + (i + 1) + "]<br>"
    }
}

function reset() {
    ret = document.getElementById("output");
    n = document.getElementById("no");
    ret.innerHTML = "生成的序列将显示在这里";
    n.innerHTML = "";
}