(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-33b2b202"],{4791:function(e,t,n){},"5d48":function(e,t,n){"use strict";n("4791")},a374:function(e,t,n){"use strict";n.r(t);var r=n("7a23"),c=Object(r["g"])("Update Password"),a=Object(r["g"])("UPDATE");function o(e,t,n,o,u,d){var s=Object(r["B"])("ion-back-button"),l=Object(r["B"])("ion-buttons"),i=Object(r["B"])("ion-title"),b=Object(r["B"])("ion-toolbar"),O=Object(r["B"])("ion-header"),j=Object(r["B"])("change-password-component"),f=Object(r["B"])("ion-content"),p=Object(r["B"])("ion-button"),w=Object(r["B"])("ion-footer"),m=Object(r["B"])("ion-page");return Object(r["u"])(),Object(r["e"])(m,null,{default:Object(r["K"])((function(){return[Object(r["h"])(O,null,{default:Object(r["K"])((function(){return[Object(r["h"])(b,null,{default:Object(r["K"])((function(){return[Object(r["h"])(l,{slot:"start"},{default:Object(r["K"])((function(){return[Object(r["h"])(s)]})),_:1}),Object(r["h"])(i,null,{default:Object(r["K"])((function(){return[c]})),_:1})]})),_:1})]})),_:1}),Object(r["h"])(f,{fullscreen:!0,class:"ion-padding"},{default:Object(r["K"])((function(){return[Object(r["h"])(j)]})),_:1}),Object(r["h"])(w,{class:"about-footer"},{default:Object(r["K"])((function(){return[Object(r["h"])(p,{onClick:e.handleUpdatePassword},{default:Object(r["K"])((function(){return[a]})),_:1},8,["onClick"])]})),_:1})]})),_:1})}var u=n("5530"),d=n("1da1"),s=(n("96cf"),n("d3b7"),n("ddb0"),n("d867")),l=n("7bb1"),i=n("6c02"),b=n("5502"),O=Object(r["L"])("data-v-4ade17d1");Object(r["x"])("data-v-4ade17d1");var j=Object(r["g"])("Current Password"),f={class:"error"},p=Object(r["g"])("Password"),w=Object(r["g"])("Confirm Password"),m={class:"error"};Object(r["v"])();var h=O((function(e,t,n,c,a,o){var u=Object(r["B"])("ion-label"),d=Object(r["B"])("ion-input"),s=Object(r["B"])("ion-item");return Object(r["u"])(),Object(r["e"])("div",null,[Object(r["h"])(s,null,{default:O((function(){return[Object(r["h"])(u,{position:"floating"},{default:O((function(){return[j]})),_:1}),Object(r["h"])(d,{type:"password",name:"credentials.current",id:"current",modelValue:e.current,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.current=t})},null,8,["modelValue"])]})),_:1}),Object(r["h"])("p",f,Object(r["E"])(e.errors["credentials.current"]),1),Object(r["h"])(s,null,{default:O((function(){return[Object(r["h"])(u,{position:"floating"},{default:O((function(){return[p]})),_:1}),Object(r["h"])(d,{modelValue:e.password,"onUpdate:modelValue":t[2]||(t[2]=function(t){return e.password=t}),type:"password",name:"credentials.password",id:"password",autocomplete:"new-password"},null,8,["modelValue"])]})),_:1}),Object(r["h"])(s,null,{default:O((function(){return[Object(r["h"])(u,{position:"floating"},{default:O((function(){return[w]})),_:1}),Object(r["h"])(d,{modelValue:e.confirm,"onUpdate:modelValue":t[3]||(t[3]=function(t){return e.confirm=t}),type:"password",name:"credentials.confirm",id:"password",autocomplete:"new-password"},null,8,["modelValue"])]})),_:1}),Object(r["h"])("p",m,Object(r["E"])(e.errors["credentials.confirm"]),1)])})),v=n("506a"),g=v["b"]({credentials:v["b"]({current:v["d"]().required().label("current"),password:v["d"]().label("Password").required().min(8),confirm:v["d"]().oneOf([v["c"]("password"),null],"Passwords must match")})}).required(),B=Object(r["i"])({name:"ChangePasswordComponent",setup:function(){var e=Object(l["a"])("credentials.current"),t=e.value,n=Object(l["a"])("credentials.password"),c=n.value,a=Object(l["a"])("credentials.confirm"),o=a.value,u=Object(b["b"])(),d=Object(r["c"])((function(){return u.state.users.user}));return d.value&&(t.value=d.value.current),{errors:Object(l["c"])(),current:t,password:c,confirm:o}},components:{IonItem:s["p"],IonInput:s["o"],IonLabel:s["q"]}});n("5d48");B.render=h,B.__scopeId="data-v-4ade17d1";var _=B,I=Object(r["i"])({components:{IonContent:s["g"],IonHeader:s["l"],IonPage:s["w"],IonTitle:s["E"],IonToolbar:s["G"],IonBackButton:s["c"],ChangePasswordComponent:_,IonButton:s["d"]},setup:function(){var e=Object(i["i"])(),t=Object(b["b"])(),n=Object(l["b"])({validationSchema:g});return{router:e,handleUpdatePassword:function(){var e=Object(d["a"])(regeneratorRuntime.mark((function e(){var r,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,n.validate();case 2:if(r=e.sent,!r.valid){e.next=7;break}return c=n.values.credentials,e.next=7,t.dispatch("users/updatePassword",Object(u["a"])({},c));case 7:case"end":return e.stop()}}),e)})));function r(){return e.apply(this,arguments)}return r}()}}});I.render=o;t["default"]=I}}]);
//# sourceMappingURL=chunk-33b2b202.d90b7544.js.map