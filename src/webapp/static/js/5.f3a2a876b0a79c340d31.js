webpackJsonp([5],{KIG0:function(e,n){},rOTh:function(e,n,o){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=o("ZUVS"),c={data:function(){return{}},computed:{},watch:{},mounted:function(){console.log(t.g)},methods:{downLoad:function(){Object(t.g)().then(function(e){console.log(e);var n=new Blob([e],{type:"application/vnd.ms-excel"}),o="template.xls";if(window.navigator.msSaveOrOpenBlob)navigator.msSaveBlob(n,o);else{var t=document.createElement("a");t.href=window.URL.createObjectURL(n),t.download=o,document.body.appendChild(t),console.log(e,n),t.click(),window.URL.revokeObjectURL(t.href)}})}}},a={render:function(){var e=this,n=e.$createElement,o=e._self._c||n;return o("div",[o("div",{on:{click:e.downLoad}},[e._v("downLoad")])])},staticRenderFns:[]};var d=o("VU/8")(c,a,!1,function(e){o("KIG0")},null,null);n.default=d.exports}});