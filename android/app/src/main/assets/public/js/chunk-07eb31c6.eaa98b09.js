(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-07eb31c6"],{"309a":function(e,t,n){"use strict";n.r(t);var o=n("7a23"),c=Object(o["g"])("About Me"),a={id:"container"},u=Object(o["g"])("UPDATE");function r(e,t,n,r,b,i){var l=Object(o["B"])("ion-back-button"),s=Object(o["B"])("ion-buttons"),j=Object(o["B"])("ion-title"),O=Object(o["B"])("ion-toolbar"),d=Object(o["B"])("ion-header"),f=Object(o["B"])("about-component"),h=Object(o["B"])("ion-content"),p=Object(o["B"])("ion-button"),v=Object(o["B"])("ion-footer"),m=Object(o["B"])("ion-page");return Object(o["u"])(),Object(o["e"])(m,null,{default:Object(o["K"])((function(){return[Object(o["h"])(d,null,{default:Object(o["K"])((function(){return[Object(o["h"])(O,null,{default:Object(o["K"])((function(){return[Object(o["h"])(s,{slot:"start"},{default:Object(o["K"])((function(){return[Object(o["h"])(l)]})),_:1}),Object(o["h"])(j,null,{default:Object(o["K"])((function(){return[c]})),_:1})]})),_:1})]})),_:1}),Object(o["h"])(h,{fullscreen:!0},{default:Object(o["K"])((function(){return[Object(o["h"])("div",a,[Object(o["h"])(f)])]})),_:1}),Object(o["h"])(v,{class:"about-footer"},{default:Object(o["K"])((function(){return[Object(o["h"])(p,{onClick:e.handleSubmit},{default:Object(o["K"])((function(){return[u]})),_:1},8,["onClick"])]})),_:1})]})),_:1})}var b=n("5530"),i=n("1da1"),l=(n("96cf"),n("99af"),n("d3b7"),n("ddb0"),n("d867")),s=n("7bb1"),j=n("5502"),O=Object(o["L"])("data-v-375e7fbc");Object(o["x"])("data-v-375e7fbc");var d={class:"about-container"},f=Object(o["h"])("h5",null,"We'd like to know more about you! Tell us something about yourself.",-1),h={class:"about-error-container"},p={class:"error",style:{visibility:"hidden"}};Object(o["v"])();var v=O((function(e,t,n,c,a,u){var r=Object(o["B"])("ion-textarea"),b=Object(o["B"])("ion-item");return Object(o["u"])(),Object(o["e"])("div",d,[f,Object(o["h"])(b,{lines:"none"},{default:O((function(){return[Object(o["h"])(r,{maxlength:"400",class:"about-area",rows:"10",cols:"30",name:"personalInfo.aboutMe",modelValue:c.aboutMe,"onUpdate:modelValue":t[1]||(t[1]=function(e){return c.aboutMe=e}),placeholder:"Tell us about yourself",width:"100%"},null,8,["modelValue"])]})),_:1}),Object(o["h"])("div",h,[Object(o["h"])("p",p,Object(o["E"])(c.errors["personalInfo.aboutMe"]),1),Object(o["h"])("p",null,Object(o["E"])(c.aboutMe?c.aboutMe.length:"0")+" / 400 Characters",1)])])})),m=n("506a"),I=n("5c40"),B=m["b"]({personalInfo:m["b"]({aboutMe:m["d"]().required("This field is Required").max(400)})}).required(),w={name:"PersonalInfo",setup:function(){var e=Object(j["b"])(),t=Object(I["e"])((function(){return e.state.users.user})),n=Object(s["a"])("personalInfo.aboutMe"),o=n.value;return o.value=t.value.aboutMe,{aboutMe:o,errors:Object(s["c"])()}},components:{IonItem:l["p"],IonTextarea:l["C"]}};n("dc53");w.render=v,w.__scopeId="data-v-375e7fbc";var k=w,M=Object(o["i"])({components:{IonContent:l["g"],IonHeader:l["l"],IonPage:l["w"],IonTitle:l["D"],IonToolbar:l["F"],IonBackButton:l["c"],AboutComponent:k},setup:function(){var e=Object(j["b"])(),t=Object(o["c"])((function(){return e.state.users.user})),n=Object(s["b"])({validationSchema:B.concat(B)});return{user:t,handleSubmit:function(){var o=Object(i["a"])(regeneratorRuntime.mark((function o(){var c,a;return regeneratorRuntime.wrap((function(o){while(1)switch(o.prev=o.next){case 0:return o.next=2,n.validate();case 2:if(c=o.sent,!c.valid){o.next=7;break}return a=n.values.personalInfo,o.next=7,e.dispatch("users/updateAbout",Object(b["a"])(Object(b["a"])({},t.value),a));case 7:case"end":return o.stop()}}),o)})));function c(){return o.apply(this,arguments)}return c}()}}});M.render=r;t["default"]=M},"5f05":function(e,t,n){},dc53:function(e,t,n){"use strict";n("5f05")}}]);
//# sourceMappingURL=chunk-07eb31c6.eaa98b09.js.map