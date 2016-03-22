/**
 * Created by xeonwell on 2016/3/22.
 */
asdf.controller("index", function(){
    console.log("index");
    this.aa = 3;
    this.data = {
        message: "hello world"
    };
    this.methods = {
        ready: function(){
          console.log("jkjkjkj");
        },
        reverse: function(){
            this.message = this.message.split("").reverse().join('');
        },
        jumpnext:function(){
            asdf.load("view1");
        }
    }
});

asdf.util.ready(function(){
    asdf.load("index");
});