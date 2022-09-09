var mapcontent; 
var filename;
var newmapstring;
var oldmapstring;

function setup() {
    document.getElementById('submitted').style.display = "none";
    document.getElementById('submitted2').style.display = "none";

    document.getElementById('buttonid').addEventListener('click', openDialog, false);
    function openDialog() {
        document.getElementById('fileid').click();
    }

    document.getElementById('fileid').addEventListener('change', showOptions, false);

    setupCollapsible();
    fill();

    document.getElementById('submit2').addEventListener('click', process, false);
    document.getElementById('old').addEventListener('click', downloadOldFile, false);
    document.getElementById('new').addEventListener('click', downloadNewFile, false);

    document.getElementById('x').addEventListener('input', prepareCanvas, false);
    document.getElementById('y').addEventListener('input', prepareCanvas, false);
    document.getElementById('xw').addEventListener('input', prepareCanvas, false);
    document.getElementById('yw').addEventListener('input', prepareCanvas, false);
}

function showOptions(event) {
    document.getElementById('upload').style.display = "none";
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('submitted').style.display = "inline";
        filename = file.name;
        document.getElementById('loaded').textContent = filename;
        mapcontent = e.target.result; 
        document.getElementById('mapcontent').textContent = mapcontent;
    };
    reader.readAsText(file);
}

function process() {
    document.getElementById('submitted').style.display = "none";
    var oldmap = mapcontent.split('>');
    for (let index = 0; index < oldmap.length; index++) {
        if (index != oldmap.length-1) {
            oldmap[index] = oldmap[index] + ">";
        } else {
            oldmap.splice(index, 1);
        }
    }
    var newmap = [];
    for (let s = 0; s <= oldmap.length-1; s++) {
        if (s == 0 || s == oldmap.length-1)  {
            newmap.push(oldmap[s]);
        } else {
            if (oldmap[s].length < 25) continue;
            const x = Math.ceil(document.getElementById('x').value);
            const y = Math.ceil(document.getElementById('y').value);
            const xw = Math.ceil(document.getElementById('xw').value);
            const yw = Math.ceil(document.getElementById('yw').value);
            const sx = Math.ceil(oldmap[s].match(/posX="((?:\\.|[^"\\])*)"/)[1]);
            const sy = Math.ceil(oldmap[s].match(/posY="((?:\\.|[^"\\])*)"/)[1]);
            if ((sx < x + xw && sx > x) && (sy < y + yw && sy > y)) {
                newmap.push(oldmap[s]);
                oldmap[s] = "";
                newmap.push(oldmap[s+1]);
                oldmap[s+1] = "";
            }
        }
    }
    oldmapstring = returnString(oldmap);
    newmapstring = returnString(newmap);

    document.getElementById('submitted2').style.display = "inline";
}

function downloadOldFile() { downloadFile("old") }
function downloadNewFile() { downloadFile("new") }
function downloadFile(oldOrNew) {
    var name;
    var file;
    switch(oldOrNew){
        case "old": 
            name = filename;
            file = oldmapstring;
        break;
        case "new": 
            name = 'cut.map';
            file = newmapstring;
        break;
        default: break;
    }
    var blob = new Blob([file], {type: "text/plain;charset=utf-8"});

    var a = document.createElement("a"),
        url = URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}

function returnString(map) {
    return map.toString().replace(/,/g," ");
}

function prepareCanvas() {
    var canvas = document.getElementById("livemap");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var img = document.getElementById("sanandreas");
    ctx.globalAlpha = 1;
    ctx.drawImage(img, 0, 0);
    const x = Math.ceil(document.getElementById('x').value);
    const y = Math.ceil(document.getElementById('y').value);
    const xw = Math.ceil(document.getElementById('xw').value);
    const yw = Math.ceil(document.getElementById('yw').value);
    if (x != "" && y != "" && xw != "" && yw != "") {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(300+x/10, 300+y/10);
        ctx.lineTo(300+((x+xw)/10), 300-(y/10));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(300+x/10, 300+y/10);
        ctx.lineTo(300+(x/10), 300-((y+yw)/10));
        ctx.stroke();
        ctx.fillStyle = "#FF0000";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.fillRect(300+x/10, 300+y/10, xw/10, -yw/10);
        ctx.stroke();
    }
}

function fill() {
    var canvas = document.getElementById("livemap");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("sanandreas");
    ctx.drawImage(img, 0, 0);
}

//Thanks W3Schools for the function below
function setupCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var mapcontent = this.nextElementSibling;
            if (mapcontent.style.display === "block") {
                mapcontent.style.display = "none";
            } else {
                mapcontent.style.display = "block";
            }
        });
    }
    var coll2 = document.getElementsByClassName("collapsible2");
    var i;
    for (i = 0; i < coll2.length; i++) {
        coll2[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var livemap = this.nextElementSibling;
            if (livemap.style.display === "block") {
                livemap.style.display = "none";
            } else {
                livemap.style.display = "block";
            }
        });
    }
}