(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{"63dc":function(e,t,a){},"6c0f":function(e,t,a){"use strict";a("63dc")},8703:function(e,t,a){"use strict";a("d5c7")},d456:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("q-splitter",{scopedSlots:e._u([{key:"before",fn:function(){return[a("tree")]},proxy:!0},{key:"after",fn:function(){return[a("detail")]},proxy:!0}]),model:{value:e.splitterModel,callback:function(t){e.splitterModel=t},expression:"splitterModel"}})],1)},n=[],s=a("e4fd"),l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"q-pa-md q-gutter-sm"},[a("div",{staticClass:"row q-col-gutter-xs"},[a("div",{staticClass:"col-8"},[a("q-input",{ref:"filterInput",attrs:{label:"Filter",dense:"",outlined:""},scopedSlots:e._u([{key:"append",fn:function(){return[""!==e.filter?a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"clear"},on:{click:e.resetFilter}}):e._e()]},proxy:!0}]),model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}})],1),a("div",{staticClass:"col"},[a("q-btn",{attrs:{dense:""},on:{click:e.toogleTree}},[e._v("Toogle")])],1)]),a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("q-tree",{ref:"tree",attrs:{nodes:e.allCat,"node-key":"Id",filter:e.filter,"default-expand-all":"","tick-strategy":"leaf",selected:e.selectedNode,ticked:e.ticked,"selected-color":"primary"},on:{"update:selected":[function(t){e.selectedNode=t},function(t){return e.fnSelectedNode(e.selectedNode)}],"update:ticked":function(t){e.ticked=t}},scopedSlots:e._u([{key:"default-header",fn:function(t){return[a("div",{staticClass:"row items-center"},[a("div",{staticStyle:{display:"inherit"}},[a("q-icon",{staticClass:"q-mr-sm",attrs:{name:t.node.icon||"share"}}),a("div",[e._v(e._s(t.node.label))]),a("q-popup-proxy",{attrs:{"context-menu":""}},[a("q-banner",{scopedSlots:e._u([{key:"avatar",fn:function(){return[a("q-icon",{attrs:{name:"signal_wifi_off",color:"primary"}})]},proxy:!0}],null,!0)},[e._v("\n                You have lost connection to the internet. This app is offline.\n              ")])],1)],1)])]}}])})],1)])])},o=[],i=function(e,t,a,r){function n(e){return e instanceof a?e:new a((function(t){t(e)}))}return new(a||(a=Promise))((function(a,s){function l(e){try{i(r.next(e))}catch(t){s(t)}}function o(e){try{i(r["throw"](e))}catch(t){s(t)}}function i(e){e.done?a(e.value):n(e.value).then(l,o)}i((r=r.apply(e,t||[])).next())}))},c=function(e,t){var a,r,n,s,l={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return s={next:o(0),throw:o(1),return:o(2)},"function"===typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function o(e){return function(t){return i([e,t])}}function i(s){if(a)throw new TypeError("Generator is already executing.");while(l)try{if(a=1,r&&(n=2&s[0]?r["return"]:s[0]?r["throw"]||((n=r["return"])&&n.call(r),0):r.next)&&!(n=n.call(r,s[1])).done)return n;switch(r=0,n&&(s=[2&s[0],n.value]),s[0]){case 0:case 1:n=s;break;case 4:return l.label++,{value:s[1],done:!1};case 5:l.label++,r=s[1],s=[0];continue;case 7:s=l.ops.pop(),l.trys.pop();continue;default:if(n=l.trys,!(n=n.length>0&&n[n.length-1])&&(6===s[0]||2===s[0])){l=0;continue}if(3===s[0]&&(!n||s[1]>n[0]&&s[1]<n[3])){l.label=s[1];break}if(6===s[0]&&l.label<n[1]){l.label=n[1],n=s;break}if(n&&l.label<n[2]){l.label=n[2],l.ops.push(s);break}n[2]&&l.ops.pop(),l.trys.pop();continue}s=t.call(e,l)}catch(o){s=[6,o],r=0}finally{a=n=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}},p=Object(s["defineComponent"])({name:"Tree",components:{},setup:function(e,t){var a=this,r=Object(s["ref"])(""),n=Object(s["ref"])(null),l=Object(s["ref"])([]),o=Object(s["ref"])(null),p=Object(s["ref"])([]),u=Object(s["ref"])(null);function d(){r.value="",n.value.focus()}function m(e){return i(this,void 0,void 0,(function(){var a,r,n,s,l;return c(this,(function(o){switch(o.label){case 0:if(a=u.value.getNodeByKey(e),null==a)return[2];switch(r=a.type,r){case"Category":return[3,1];case"TestSuite":return[3,2];case"TestGroup":return[3,3];case"TestCase":return[3,4]}return[3,8];case 1:return console.log("Category"),[3,9];case 2:return console.log("TestSuite"),[3,9];case 3:return console.log("TestGroup"),[3,9];case 4:return n=t.root.$store.getters["testcase/opennedTCs"],s=n.some((function(e){return e.Id===a.Id})),s?(l=n.find((function(e){return e.Id===a.Id})),t.root.$store.commit("testcase/setOpennedTCs",l),[3,7]):[3,5];case 5:return[4,t.root.$store.dispatch("testcase/getTestCasebyId",a.Id)];case 6:o.sent(),o.label=7;case 7:return[3,9];case 8:return[3,9];case 9:return[2]}}))}))}function f(){u.value.collapseAll()}return Object(s["onMounted"])((function(){return i(a,void 0,void 0,(function(){var e;return c(this,(function(a){switch(a.label){case 0:return a.trys.push([0,3,,4]),[4,t.root.$store.dispatch("category/getAllCategories")];case 1:return a.sent(),l.value=t.root.$store.getters["category/categories"],console.log("allCat",l.value),[4,t.root.$nextTick()];case 2:return a.sent(),u.value.expandAll(),[3,4];case 3:return e=a.sent(),t.root.$q.notify({type:"negative",message:""+e}),[3,4];case 4:return[2]}}))}))})),{filter:r,resetFilter:d,allCat:l,filterInput:n,selectedNode:o,ticked:p,fnSelectedNode:m,tree:u,toogleTree:f}}}),u=p,d=(a("8703"),a("2877")),m=a("27f9"),f=a("0016"),b=a("9c40"),y=a("7f41"),v=a("7cbe"),w=a("54e1"),q=a("eebe"),_=a.n(q),C=Object(d["a"])(u,l,o,!1,null,"4760d9c8",null),h=C.exports;_()(C,"components",{QInput:m["a"],QIcon:f["a"],QBtn:b["a"],QTree:y["a"],QPopupProxy:v["a"],QBanner:w["a"]});var k=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"q-pa-xs"},[a("div",{staticClass:"row q-col-gutter-xs"},[a("div",{staticClass:"col"},[a("q-tabs",{attrs:{dense:"","active-color":"primary",align:"left","inline-label":""},model:{value:e.selectedTC,callback:function(t){e.selectedTC=t},expression:"selectedTC"}},e._l(e.testcases,(function(t){return a("q-tab",{key:t.Id,attrs:{name:t.Id,ripple:!1},on:{mouseover:function(a){e.showByIndex=t.Id},mouseout:function(t){e.showByIndex=null}}},[a("div",{staticClass:"q-mr-xs"},[e._v(e._s(t.Name))]),a("q-btn",{style:{visibility:e.showByIndex===t.Id?"visible":"hidden"},attrs:{dense:"",flat:"",icon:"close",size:"xs"},on:{click:function(a){return a.stopPropagation(),e.closeTab(t)}}})],1)})),1),a("q-tab-panels",{attrs:{animated:"","keep-alive":""},model:{value:e.selectedTC,callback:function(t){e.selectedTC=t},expression:"selectedTC"}},e._l(e.testcases,(function(t){return a("q-tab-panel",{key:t.Id,attrs:{name:t.Id}},[a("q-table",{attrs:{dense:"",data:t.TestSteps,columns:e.columns,"row-key":"name","hide-pagination":!0,separator:"cell","wrap-cells":!1},scopedSlots:e._u([{key:"body",fn:function(t){return[a("q-tr",{attrs:{props:t}},[a("q-td",{key:"no",staticClass:"q-c-input",attrs:{props:t}},[e._v("\n                  "+e._s(t.row.TestClient)+"\n                ")]),a("q-td",{key:"client",staticClass:"q-c-input",attrs:{props:t}},[e._v("\n                  "+e._s(t.row.TestClient)+"\n                ")]),a("q-td",{key:"keyword",staticClass:"q-c-input",attrs:{props:t}},[a("q-input",{attrs:{dense:"",borderless:""},model:{value:t.row.Keyword,callback:function(a){e.$set(t.row,"Keyword",a)},expression:"props.row.Keyword"}})],1),a("q-td",{key:"param1",staticClass:"q-c-input",attrs:{props:t}},[e._v("\n                  "+e._s(t.row.Params[0].Value)+"\n                ")]),a("q-td",{key:"param2",staticClass:"q-c-input",attrs:{props:t}},[e._v("\n                  "+e._s(t.row.Description)+"\n                ")]),a("q-td",{key:"param3",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param4",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param5",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param6",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param7",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param8",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param9",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param10",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param11",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param12",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param13",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param14",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param15",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param16",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param17",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param18",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param19",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")]),a("q-td",{key:"param20",staticClass:"q-c-input",staticStyle:{"white-space":"normal"},attrs:{props:t}},[e._v("\n                  "+e._s(t.row.ExampleValue)+"\n                ")])],1)]}}],null,!0)})],1)})),1)],1)]),e._m(0)])},x=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"row"},[a("div",{staticClass:"col"})])}],T=Object(s["defineComponent"])({name:"Detail",components:{},setup:function(e,t){var a=Object(s["ref"])(null),r=Object(s["ref"])([{name:"no",required:!0,label:"No",align:"left",field:"rowIndex",sortable:!1,style:"max-width: 40px",headerStyle:"max-width: 40px"},{name:"client",align:"center",label:"Client",field:"calories",sortable:!1},{name:"keyword",label:"Keyword",field:"fat",sortable:!1},{name:"param1",label:"Param 1",field:"carbs",sortable:!1},{name:"param2",label:"Param 2",field:"protein",sortable:!1},{name:"param3",label:"Param 3",field:"sodium",sortable:!1},{name:"param4",label:"Param 4",field:"calcium",sortable:!1},{name:"param5",label:"Param 5",field:"iron",sortable:!1},{name:"param6",label:"Param 6",field:"iron",sortable:!1},{name:"param7",label:"Param 7",field:"iron",sortable:!1},{name:"param8",label:"Param 8",field:"iron",sortable:!1},{name:"param9",label:"Param 9",field:"iron",sortable:!1},{name:"param10",label:"Param 10",field:"iron",sortable:!1},{name:"param11",label:"Param 11",field:"iron",sortable:!1},{name:"param12",label:"Param 12",field:"iron",sortable:!1},{name:"param13",label:"Param 13",field:"iron",sortable:!1},{name:"param14",label:"Param 14",field:"iron",sortable:!1},{name:"param15",label:"Param 15",field:"iron",sortable:!1},{name:"param16",label:"Param 16",field:"iron",sortable:!1},{name:"param17",label:"Param 17",field:"iron",sortable:!1},{name:"param18",label:"Param 18",field:"iron",sortable:!1},{name:"param19",label:"Param 19",field:"iron",sortable:!1},{name:"param20",label:"Param 20",field:"iron",sortable:!1}]),n=Object(s["ref"])([{name:"Frozen Yogurt",calories:159,fat:6,carbs:24,protein:4,sodium:87,calcium:"14%",iron:"1%"},{name:"Ice cream sandwich",calories:237,fat:9,carbs:37,protein:4.3,sodium:129,calcium:"8%",iron:"1%"},{name:"Eclair",calories:262,fat:16,carbs:23,protein:6,sodium:337,calcium:"6%",iron:"7%"},{name:"Cupcake",calories:305,fat:3.7,carbs:67,protein:4.3,sodium:413,calcium:"3%",iron:"8%"},{name:"Gingerbread",calories:356,fat:16,carbs:49,protein:3.9,sodium:327,calcium:"7%",iron:"16%"},{name:"Jelly bean",calories:375,fat:0,carbs:94,protein:0,sodium:50,calcium:"0%",iron:"0%"},{name:"Lollipop",calories:392,fat:.2,carbs:98,protein:0,sodium:38,calcium:"0%",iron:"2%"},{name:"Honeycomb",calories:408,fat:3.2,carbs:87,protein:6.5,sodium:562,calcium:"0%",iron:"45%"},{name:"Donut",calories:452,fat:25,carbs:51,protein:4.9,sodium:326,calcium:"2%",iron:"22%"},{name:"KitKat",calories:518,fat:26,carbs:65,protein:7,sodium:54,calcium:"12%",iron:"6%"}]),l=Object(s["computed"])({get:function(){return t.root.$store.getters["testcase/opennedSelectedTC"]},set:function(e){t.root.$store.commit("testcase/setOpennedSelectedTC",e)}}),o=Object(s["computed"])({get:function(){return t.root.$store.getters["testcase/opennedTCs"]},set:function(e){t.root.$store.dispatch("testcase/updateOpennedTCs",e)}});function i(e){console.log("testcase",e),t.root.$store.commit("testcase/removeOpennedTC",e.Id)}return{showByIndex:a,columns:r,data:n,testcases:o,selectedTC:l,closeTab:i}}}),g=T,S=(a("6c0f"),a("429b")),P=a("7460"),I=a("adad"),E=a("823b"),O=a("eaac"),j=a("bd08"),V=a("db86"),$=Object(d["a"])(g,k,x,!1,null,"86ce6d48",null),Q=$.exports;_()($,"components",{QTabs:S["a"],QTab:P["a"],QBtn:b["a"],QTabPanels:I["a"],QTabPanel:E["a"],QTable:O["a"],QTr:j["a"],QTd:V["a"],QInput:m["a"]});var N=Object(s["defineComponent"])({name:"TestPlan",components:{Tree:h,Detail:Q},setup:function(){var e=Object(s["ref"])(20);return{splitterModel:e}}}),B=N,K=a("8562"),M=Object(d["a"])(B,r,n,!1,null,null,null);t["default"]=M.exports;_()(M,"components",{QSplitter:K["a"]})},d5c7:function(e,t,a){}}]);