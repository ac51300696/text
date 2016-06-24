var n=600, data=new Array(), swap_ops=new Array(), call_stack=[[0, n-1]], blocks=new Array();
for (i=0; i<n; i++) {data.push(i);}
for (i=data.length-1; i>0; i--) {data[i] = data.splice(Math.floor(Math.random() * i), 1, data[i])[0];}
for (i=0; i<n; i++) {
    blocks.push(document.createElement("div"));
    blocks[i].style.width = 100.0/n + "%";
    blocks[i].style.height = data[i]*100.0/n + "%";
    document.getElementById("canvas").appendChild(blocks[i]);
}
while (call_stack.length > 0) {
    curr_call = call_stack.pop(), lbb=curr_call[0], ubb=curr_call[1];
    for (div=i=lbb; i<ubb; i++)
    if (data[i] < data[ubb]) {
        swap_ops.push([i, div]);
        data[i] = data.splice(div++, 1, data[i])[0];
    }
    swap_ops.push([ubb, div]);
    data[ubb] = data.splice(div, 1, data[ubb])[0];
    if (lbb < div-1) call_stack.push([lbb, div-1]);
    if (div+1 < ubb) call_stack.push([div+1, ubb]);
}  
var ses_interv = window.setInterval(function () {
    if (swap_ops.length > 0) {
        curr_swap = swap_ops.shift(), i=curr_swap[0], j=curr_swap[1];
        t=blocks[i].style.height;
        blocks[i].style.height=blocks[j].style.height;
        blocks[j].style.height=t;
    } else {window.clearInterval(ses_interv);}
}, 5);