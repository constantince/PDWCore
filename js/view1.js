/**
 * Created by xeonwell on 2016/3/22.
 */
asdf.controller("view1", function(page){
    console.log("view1");

    var txt = document.createElement("div");
    txt.nodeValue = "index page append.";
    page.appendChild(txt);

    return {
        destroyed:function(){
            console.log("destroyed");
        },
        methods:{
            jumpback:function(){
                asdf.back();
            }

        }
    }
});