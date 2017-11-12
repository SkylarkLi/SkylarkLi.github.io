/**
 * Created by w on 2016/10/26.
 */
function fold(id) {
    var ele = document.getElementById(id);
    var folded = document.createElement("div");
    var backgroundColor = (function (element) {
        var parent = element.parentElement;
        return (window.getComputedStyle) ? window.getComputedStyle(parent).backgroundColor : parent.currentStyle["background-color"];
    })(ele);//不能闭包
    folded.setAttribute("class", "folded");
    if (window.getComputedStyle(ele).position != "relative")
        ele.style.position = "relative";
    if (window.getComputedStyle(ele).overflow != "hidden")
        ele.style.overflow = "hidden";
    folded.style.cssText = "width: 0;height: 0;"
        + "position: absolute;"
        + "bottom: 0;"
        + "right: 0;"
        + "border: solid;"
        + "border-width: 0 0 30px  30px;"
        + "border-color:transparent transparent " + backgroundColor + " rgba(0, 0, 0, 0.2);"
        + "-webkit-box-shadow: 0 2px 2px rgba(0,0,0,0.6), -2px 2px 2px rgba(0,0,0,0.3);"
        + "-moz-box-shadow: 0 2px 2px rgba(0,0,0,0.6), -2px 2px 2px rgba(0,0,0,0.3);"
        + "box-shadow: 0 2px 2px rgba(0,0,0,0.6), -2px 2px 2px rgba(0,0,0,0.3);";
    ele.appendChild(folded);
}

