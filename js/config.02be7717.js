(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["config"],{4466:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h3",[e._v("Config.")]),e._m(0),n("p",[n("b-input-group",{staticClass:"mt-3"},[n("b-input",{model:{value:e.temp_url,callback:function(t){e.temp_url=t},expression:"temp_url"}}),n("b-input-group-append",[n("b-button",{attrs:{variant:"outline-success"},on:{click:e.tempUrlChanged}},[e._v("Change Agora")])],1)],1),n("b-button",{on:{click:e.reset}},[e._v("Reset to "),n("b",[e._v("default Agora POD")])])],1)])},o=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("p",[e._v("Here you can change to your prefered Agora POD. A agora POD is used to agglomerate annonces."),n("br"),e._v(" You must be able to write to this agora POD, and people you want to share your annonce must be able to read this uri."),n("br")])}],a=n("1da1"),u=(n("96cf"),{name:"AnnonceConfig",data:function(){return{}},methods:{reset:function(){this.temp_url=this.$store.state.annonce.defaultAgoraPod},tempUrlChanged:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.agora_url=e.temp_url;case 1:case"end":return t.stop()}}),t)})))()}},computed:{temp_url:{get:function(){return this.$store.state.annonce.agora_url},set:function(e){this.$store.commit("annonce/setAgoraUrl",e)}}}}),s=u,c=n("2877"),i=Object(c["a"])(s,r,o,!1,null,null,null);t["default"]=i.exports}}]);
//# sourceMappingURL=config.02be7717.js.map