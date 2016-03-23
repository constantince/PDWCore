/**
 * Created by xeonwell on 2016/3/22.
 */
asdf.controller("view1", function(page, args){
    console.log("view1");
    console.log(JSON.stringify(args));

    var context = this;
    var txt = document.createElement("div");
    txt.nodeValue = "index page append.";
    page.appendChild(txt);

    return {
        destroyed:function(){
            console.log("destroyed");
        },
        methods:{
            jumpback:function(){
                context.callback({a:"99797"});
                asdf.back();
            }

        }
    }
});