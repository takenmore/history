/**
 * Created by jacky on 2017/5/25.
 */
var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");
var img=new Image();
var img2=new Image();
var x=450;
var y=270;
img2.src="img/location.png";
img.src="img/养老院地图.png";
cxt.drawImage(img,0,0,600,514);
cxt.drawImage(img2,150,100,img2.width/2,img2.height/2);
window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
    var screenwidth=window.screen.availWidth;
    var screenheight=window.screen.availHeight;
    var C_screenwidth=document.body.clientWidth;
    var C_screenheight=document.body.clientHeight;
    // 获取屏幕宽高以及网页可用的宽高
    img.onload=function(){
        cxt.drawImage(img,0,0,w,h);
    };
    img2.onload=function(){
        cxt.drawImage(img,x,y,w,h);
    };
    w = c.width =600*(C_screenwidth/screenwidth);
    h = c.height =580*(C_screenheight/screenheight) ;
    cxt.drawImage(img,0,0,w,h);
    cxt.drawImage(img2,x*C_screenwidth/screenwidth,y*C_screenheight/screenheight,(img2.width/2)*C_screenwidth/screenwidth,(img2.height/2)*C_screenheight/screenheight);
}
document.onkeyup = function move(event) {
    //检测事件
    var e = event || window.event;
    var keyCode = e.keyCode || e.which;
    switch (keyCode) {
        case 87:
            // 按下W键
           y=y-10;
            cxt.drawImage(img2,x,y,img2.width/3,img2.height/3);
            break;
        // 按下D键
        case 68:
            x=x+10;
            cxt.drawImage(img2,x,y,img2.width/3,img2.height/3);
            break;
        // 按下S键
        case 83:
           y=y+10;
            cxt.drawImage(img2,x,y,img2.width/3,img2.height/3);
            break;
        // 按下A键
        case 65:
            x=x-10;
            cxt.drawImage(img2,x,y,img2.width/3,img2.height/3);;
            break;
        case 38:
            // 按下向上键
            y=y-10;
            cxt.drawImage(img2,x,y,img2.width/3,img2.height/3);
            break;
        // 按下向右键
        case 39:
            x=x+10;
            cxt.drawImage(img2,x,y,img2.width/3,img2.height/3);
            break;
        // 按下向下键
        case 40:
            y=y+10;
            cxt.drawImage(img2,x,y,img2.width/3,img2.height/3);
            break;
        // 按下向左键
        case 37:
            x=x-10;
            cxt.drawImage(img2,x,y,img2.width/3,img2.height/3);
            break;
        default:
            break;
    }
}
