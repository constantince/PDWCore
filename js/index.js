/**
 * Created by xeonwell on 2016/3/22.
 */
asdf.controller("index", function (page) {
    console.log("index");
    var txt = document.createElement("div");
    txt.innerHTML = "index page append.";
    page.querySelector(".container").appendChild(txt);
    //this.aa = 3;

    return {
        created: function () {
            console.log("created");
        },
        data: {
            message: "hello world"
        },
        methods: {
            reverse: function () {
                this.message = this.message.split("").reverse().join('');
            },
            jumpnext: function () {
                asdf.load("view1");
            }
        }
    };
});

asdf.util.ready(function () {
    asdf.load("index");
});