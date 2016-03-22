/**
 * Created by xeonwell on 2016/3/22.
 */
asdf.controller("index", function () {
    console.log("index");
    this.aa = 3;

    return {
        created: function () {
            console.log("jkjkjkj");
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