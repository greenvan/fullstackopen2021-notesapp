(this.webpackJsonppart2=this.webpackJsonppart2||[]).push([[0],{42:function(t,e,n){},43:function(t,e,n){"use strict";n.r(e);var r=n(17),a=n.n(r),c=n(3),o=n.n(c),i=n(5),u=n(8),s=n(4),l=n(1),j=n(0),p=function(t){var e=t.note,n=t.toggleImportance,r=e.important?"make not important":"make important";return Object(j.jsxs)("li",{className:"note",children:[e.content,Object(j.jsx)("button",{onClick:n,children:r})]})},f=n(6),b=n.n(f),d="/api/notes",O=null,m={getAll:function(){var t=b.a.get(d),e={id:1e4,content:"This note is not saved to server",date:"2019-05-30T17:30:31.098Z",important:!0};return t.then((function(t){return t.data.concat(e)}))},create:function(){var t=Object(i.a)(o.a.mark((function t(e){var n,r;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n={headers:{Authorization:O}},t.next=3,b.a.post(d,e,n);case 3:return r=t.sent,t.abrupt("return",r.data);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),update:function(t,e){return b.a.put("".concat(d,"/").concat(t),e).then((function(t){return t.data}))},setToken:function(t){O="bearer ".concat(t)}},h=function(t){var e=t.message;return null===e?null:Object(j.jsx)("div",{className:"error",children:e})},v={login:function(){var t=Object(i.a)(o.a.mark((function t(e){var n;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b.a.post("/api/login",e);case 2:return n=t.sent,t.abrupt("return",n.data);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},g=function(){return Object(j.jsxs)("div",{style:{color:"green",fontStyle:"italic",fontSize:16},children:[Object(j.jsx)("br",{}),Object(j.jsx)("em",{children:"Note app, Department of Computer Science, University of Helsinki 2020"})]})},x=function(t){var e=Object(l.useState)([]),n=Object(s.a)(e,2),r=n[0],a=n[1],c=Object(l.useState)("a new note..."),f=Object(s.a)(c,2),b=f[0],d=f[1],O=Object(l.useState)(!0),x=Object(s.a)(O,2),w=x[0],S=x[1],k=Object(l.useState)(null),y=Object(s.a)(k,2),N=y[0],T=y[1],C=Object(l.useState)(""),I=Object(s.a)(C,2),D=I[0],J=I[1],U=Object(l.useState)(""),A=Object(s.a)(U,2),E=A[0],z=A[1],B=Object(l.useState)(null),H=Object(s.a)(B,2),M=H[0],P=H[1];Object(l.useEffect)((function(){m.getAll().then((function(t){a(t)}))}),[]),Object(l.useEffect)((function(){var t=window.localStorage.getItem("loggedNoteappUser");if(t){var e=JSON.parse(t);P(e),m.setToken(e.token)}}),[]);var W=function(t){t.preventDefault();var e={content:b,date:(new Date).toISOString(),important:Math.random()<.5};m.create(e).then((function(t){a(r.concat(t)),d("")}))},Z=function(t){d(t.target.value)},q=w?r:r.filter((function(t){return t.important})),F=function(){var t=Object(i.a)(o.a.mark((function t(e){var n;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),console.log("logging in with",D,E),t.prev=2,t.next=5,v.login({username:D,password:E});case 5:n=t.sent,window.localStorage.setItem("loggedNoteappUser",JSON.stringify(n)),m.setToken(n.token),P(n),J(""),z(""),t.next=17;break;case 13:t.prev=13,t.t0=t.catch(2),T("Wrong credentials"),setTimeout((function(){T(null)}),5e3);case 17:case"end":return t.stop()}}),t,null,[[2,13]])})));return function(e){return t.apply(this,arguments)}}();return Object(j.jsxs)("div",{children:[Object(j.jsx)("h1",{children:"Notes"}),Object(j.jsx)(h,{message:N}),null===M?Object(j.jsxs)("form",{onSubmit:F,children:[Object(j.jsxs)("div",{children:["username",Object(j.jsx)("input",{type:"text",value:D,name:"Username",onChange:function(t){var e=t.target;return J(e.value)}})]}),Object(j.jsxs)("div",{children:["password",Object(j.jsx)("input",{type:"password",value:E,name:"Password",onChange:function(t){var e=t.target;return z(e.value)}})]}),Object(j.jsx)("button",{type:"submit",children:"login"})]}):Object(j.jsxs)("div",{children:[Object(j.jsxs)("p",{children:[M.name," logged-in"]}),Object(j.jsxs)("form",{onSubmit:W,children:[Object(j.jsx)("input",{value:b,onChange:Z}),Object(j.jsx)("button",{type:"submit",children:"save"})]})]}),Object(j.jsx)("hr",{}),Object(j.jsx)("div",{children:Object(j.jsxs)("button",{onClick:function(){return S(!w)},children:["show ",w?"important":"all"]})}),Object(j.jsx)("ul",{children:q.map((function(t){return Object(j.jsx)(p,{note:t,toggleImportance:function(){return function(t){var e=r.find((function(e){return e.id===t})),n=Object(u.a)(Object(u.a)({},e),{},{important:!e.important});m.update(t,n).then((function(e){a(r.map((function(n){return n.id!==t?n:e})))})).catch((function(n){T("Note '".concat(e.content,"' was already removed from server")),setTimeout((function(){T(null)}),5e3),a(r.filter((function(e){return e.id!==t})))}))}(t.id)}},t.id)}))}),Object(j.jsx)(g,{})]})};n(42);a.a.render(Object(j.jsx)(x,{}),document.getElementById("root"))}},[[43,1,2]]]);
//# sourceMappingURL=main.d67af05e.chunk.js.map