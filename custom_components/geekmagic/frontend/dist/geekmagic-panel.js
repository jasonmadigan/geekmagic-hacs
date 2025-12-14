/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, F = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = Symbol(), K = /* @__PURE__ */ new WeakMap();
let ae = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (F && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = K.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && K.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const pe = (s) => new ae(typeof s == "string" ? s : s + "", void 0, G), ue = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[n + 1], s[0]);
  return new ae(t, s, G);
}, ge = (s, e) => {
  if (F) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), r = R.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = t.cssText, s.appendChild(i);
  }
}, Q = F ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return pe(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _e, defineProperty: ve, getOwnPropertyDescriptor: fe, getOwnPropertyNames: me, getOwnPropertySymbols: $e, getPrototypeOf: ye } = Object, y = globalThis, X = y.trustedTypes, we = X ? X.emptyScript : "", I = y.reactiveElementPolyfillSupport, V = (s, e) => s, j = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? we : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, Z = (s, e) => !_e(s, e), Y = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Y) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, t);
      r !== void 0 && ve(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: r, set: n } = fe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: r, set(o) {
      const c = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = ye(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const t = this.properties, i = [...me(t), ...$e(t)];
      for (const r of i) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, r] of t) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const r = this._$Eu(t, i);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) t.unshift(Q(r));
    } else e !== void 0 && t.push(Q(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ge(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var n;
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : j).toAttribute(t, i.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, o;
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const c = i.getPropertyOptions(r), a = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((n = c.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? c.converter : j;
      this._$Em = r;
      const h = a.fromAttribute(t, c.type);
      this[r] = h ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, t, i) {
    var r;
    if (e !== void 0) {
      const n = this.constructor, o = this[e];
      if (i ?? (i = n.getPropertyOptions(e)), !((i.hasChanged ?? Z)(o, t) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(n._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: c } = o, a = this[n];
        c !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[V("elementProperties")] = /* @__PURE__ */ new Map(), E[V("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: E }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, D = C.trustedTypes, ee = D ? D.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ce = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, le = "?" + $, be = `<${le}>`, A = document, O = () => A.createComment(""), H = (s) => s === null || typeof s != "object" && typeof s != "function", J = Array.isArray, xe = (s) => J(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", B = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, te = /-->/g, ie = />/g, w = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), se = /'/g, re = /"/g, de = /^(?:script|style|textarea|title)$/i, Ae = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), p = Ae(1), S = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ne = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function he(s, e) {
  if (!J(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ee !== void 0 ? ee.createHTML(e) : e;
}
const Ee = (s, e) => {
  const t = s.length - 1, i = [];
  let r, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = k;
  for (let c = 0; c < t; c++) {
    const a = s[c];
    let h, u, l = -1, v = 0;
    for (; v < a.length && (o.lastIndex = v, u = o.exec(a), u !== null); ) v = o.lastIndex, o === k ? u[1] === "!--" ? o = te : u[1] !== void 0 ? o = ie : u[2] !== void 0 ? (de.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = w) : u[3] !== void 0 && (o = w) : o === w ? u[0] === ">" ? (o = r ?? k, l = -1) : u[1] === void 0 ? l = -2 : (l = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? w : u[3] === '"' ? re : se) : o === re || o === se ? o = w : o === te || o === ie ? o = k : (o = w, r = void 0);
    const m = o === w && s[c + 1].startsWith("/>") ? " " : "";
    n += o === k ? a + be : l >= 0 ? (i.push(h), a.slice(0, l) + ce + a.slice(l) + $ + m) : a + $ + (l === -2 ? c : m);
  }
  return [he(s, n + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const c = e.length - 1, a = this.parts, [h, u] = Ee(e, t);
    if (this.el = U.createElement(h, i), b.currentNode = this.el.content, t === 2 || t === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = b.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(ce)) {
          const v = u[o++], m = r.getAttribute(l).split($), N = /([.?@])?(.*)/.exec(v);
          a.push({ type: 1, index: n, name: N[2], strings: m, ctor: N[1] === "." ? Pe : N[1] === "?" ? ke : N[1] === "@" ? Ve : z }), r.removeAttribute(l);
        } else l.startsWith($) && (a.push({ type: 6, index: n }), r.removeAttribute(l));
        if (de.test(r.tagName)) {
          const l = r.textContent.split($), v = l.length - 1;
          if (v > 0) {
            r.textContent = D ? D.emptyScript : "";
            for (let m = 0; m < v; m++) r.append(l[m], O()), b.nextNode(), a.push({ type: 2, index: ++n });
            r.append(l[v], O());
          }
        }
      } else if (r.nodeType === 8) if (r.data === le) a.push({ type: 2, index: n });
      else {
        let l = -1;
        for (; (l = r.data.indexOf($, l + 1)) !== -1; ) a.push({ type: 7, index: n }), l += $.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const i = A.createElement("template");
    return i.innerHTML = e, i;
  }
}
function P(s, e, t = s, i) {
  var o, c;
  if (e === S) return e;
  let r = i !== void 0 ? (o = t._$Co) == null ? void 0 : o[i] : t._$Cl;
  const n = H(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((c = r == null ? void 0 : r._$AO) == null || c.call(r, !1), n === void 0 ? r = void 0 : (r = new n(s), r._$AT(s, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = r : t._$Cl = r), r !== void 0 && (e = P(s, r._$AS(s, e.values), r, i)), e;
}
class Se {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? A).importNode(t, !0);
    b.currentNode = r;
    let n = b.nextNode(), o = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new T(n, n.nextSibling, this, e) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (h = new Ce(n, this, e)), this._$AV.push(h), a = i[++c];
      }
      o !== (a == null ? void 0 : a.index) && (n = b.nextNode(), o++);
    }
    return b.currentNode = A, r;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class T {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = P(this, e, t), H(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== S && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && H(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = U.createElement(he(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(t);
    else {
      const o = new Se(r, this), c = o.u(this.options);
      o.p(t), this.T(c), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ne.get(e.strings);
    return t === void 0 && ne.set(e.strings, t = new U(e)), t;
  }
  k(e) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const n of e) r === t.length ? t.push(i = new T(this.O(O()), this.O(O()), this, this.options)) : i = t[r], i._$AI(n), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const r = e.nextSibling;
      e.remove(), e = r;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, r, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(e, t = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = P(this, e, t, 0), o = !H(e) || e !== this._$AH && e !== S, o && (this._$AH = e);
    else {
      const c = e;
      let a, h;
      for (e = n[0], a = 0; a < n.length - 1; a++) h = P(this, c[i + a], t, a), h === S && (h = this._$AH[a]), o || (o = !H(h) || h !== this._$AH[a]), h === d ? e = d : e !== d && (e += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pe extends z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class ke extends z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Ve extends z {
  constructor(e, t, i, r, n) {
    super(e, t, i, r, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? d) === S) return;
    const i = this._$AH, r = e === d && i !== d || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ce {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const W = C.litHtmlPolyfillSupport;
W == null || W(U, T), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.3.1");
const Me = (s, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = r = new T(e.insertBefore(O(), n), n, void 0, t ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class M extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Me(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return S;
  }
}
var oe;
M._$litElement$ = !0, M.finalized = !0, (oe = x.litElementHydrateSupport) == null || oe.call(x, { LitElement: M });
const q = x.litElementPolyfillSupport;
q == null || q({ LitElement: M });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oe = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: Z }, Ue = (s = He, e, t) => {
  const { kind: i, metadata: r } = t;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(t.name, s), i === "accessor") {
    const { name: o } = t;
    return { set(c) {
      const a = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(o, a, s);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, s, c), c;
    } };
  }
  if (i === "setter") {
    const { name: o } = t;
    return function(c) {
      const a = this[o];
      e.call(this, c), this.requestUpdate(o, a, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function L(s) {
  return (e, t) => typeof t == "object" ? Ue(s, e, t) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(s) {
  return L({ ...s, state: !0, attribute: !1 });
}
var Te = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, _ = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Le(e, t) : e, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(e, t, r) : o(r)) || r);
  return i && r && Te(e, t, r), r;
};
function Ne(s, e) {
  let t;
  return (...i) => {
    clearTimeout(t), t = setTimeout(() => s(...i), e);
  };
}
let g = class extends M {
  constructor() {
    super(...arguments), this.narrow = !1, this._page = "views", this._config = null, this._views = [], this._devices = [], this._editingView = null, this._previewImage = null, this._previewLoading = !1, this._loading = !0, this._saving = !1, this._refreshPreview = Ne(async () => {
      if (this._editingView) {
        this._previewLoading = !0;
        try {
          const s = await this.hass.connection.sendMessagePromise({
            type: "geekmagic/preview/render",
            view_config: {
              layout: this._editingView.layout,
              theme: this._editingView.theme,
              widgets: this._editingView.widgets
            }
          });
          this._previewImage = s.image;
        } catch (s) {
          console.error("Failed to render preview:", s);
        } finally {
          this._previewLoading = !1;
        }
      }
    }, 500);
  }
  firstUpdated() {
    this._loadData();
  }
  async _loadData() {
    this._loading = !0;
    try {
      const [s, e, t] = await Promise.all([
        this.hass.connection.sendMessagePromise({
          type: "geekmagic/config"
        }),
        this.hass.connection.sendMessagePromise({
          type: "geekmagic/views/list"
        }),
        this.hass.connection.sendMessagePromise({
          type: "geekmagic/devices/list"
        })
      ]);
      this._config = s, this._views = e.views, this._devices = t.devices;
    } catch (s) {
      console.error("Failed to load GeekMagic config:", s);
    } finally {
      this._loading = !1;
    }
  }
  async _createView() {
    const s = prompt("Enter view name:", "New View");
    if (s)
      try {
        const e = await this.hass.connection.sendMessagePromise({
          type: "geekmagic/views/create",
          name: s,
          layout: "grid_2x2",
          theme: "classic",
          widgets: []
        });
        this._views = [...this._views, e.view], this._editView(e.view);
      } catch (e) {
        console.error("Failed to create view:", e);
      }
  }
  _editView(s) {
    this._editingView = { ...s, widgets: [...s.widgets] }, this._page = "editor", this._refreshPreview();
  }
  async _saveView() {
    if (this._editingView) {
      this._saving = !0;
      try {
        await this.hass.connection.sendMessagePromise({
          type: "geekmagic/views/update",
          view_id: this._editingView.id,
          name: this._editingView.name,
          layout: this._editingView.layout,
          theme: this._editingView.theme,
          widgets: this._editingView.widgets
        }), this._views = this._views.map(
          (s) => s.id === this._editingView.id ? this._editingView : s
        ), this._page = "views", this._editingView = null;
      } catch (s) {
        console.error("Failed to save view:", s);
      } finally {
        this._saving = !1;
      }
    }
  }
  async _deleteView(s) {
    if (confirm(`Delete view "${s.name}"?`))
      try {
        await this.hass.connection.sendMessagePromise({
          type: "geekmagic/views/delete",
          view_id: s.id
        }), this._views = this._views.filter((e) => e.id !== s.id);
      } catch (e) {
        console.error("Failed to delete view:", e);
      }
  }
  _updateEditingView(s) {
    this._editingView && (this._editingView = { ...this._editingView, ...s }, this._refreshPreview());
  }
  _updateWidget(s, e) {
    if (!this._editingView) return;
    const t = [...this._editingView.widgets], i = t.findIndex((r) => r.slot === s);
    i >= 0 ? t[i] = { ...t[i], ...e } : t.push({ slot: s, type: "", ...e }), this._editingView = { ...this._editingView, widgets: [...t] }, this.requestUpdate(), this._refreshPreview();
  }
  async _toggleDeviceView(s, e, t) {
    const i = t ? [...s.assigned_views, e] : s.assigned_views.filter((r) => r !== e);
    try {
      await this.hass.connection.sendMessagePromise({
        type: "geekmagic/devices/assign_views",
        entry_id: s.entry_id,
        view_ids: i
      }), this._devices = this._devices.map(
        (r) => r.entry_id === s.entry_id ? { ...r, assigned_views: i } : r
      );
    } catch (r) {
      console.error("Failed to update device views:", r);
    }
  }
  render() {
    return this._loading ? p`
        <div class="loading">
          <ha-circular-progress indeterminate></ha-circular-progress>
        </div>
      ` : p`
      <div class="header">
        <ha-icon icon="mdi:monitor-dashboard"></ha-icon>
        <span class="header-title">GeekMagic</span>
        ${this._page !== "editor" ? p`
              <mwc-tab-bar
                class="header-tabs"
                @MDCTabBar:activated=${(s) => {
      this._page = s.detail.index === 0 ? "views" : "devices";
    }}
              >
                <mwc-tab label="Views" ?active=${this._page === "views"}></mwc-tab>
                <mwc-tab label="Devices" ?active=${this._page === "devices"}></mwc-tab>
              </mwc-tab-bar>
            ` : d}
      </div>
      <div class="content">${this._renderPage()}</div>
    `;
  }
  _renderPage() {
    switch (this._page) {
      case "views":
        return this._renderViewsList();
      case "devices":
        return this._renderDevicesList();
      case "editor":
        return this._renderEditor();
    }
  }
  _renderViewsList() {
    return p`
      <div class="views-grid">
        ${this._views.map(
      (s) => {
        var e, t, i;
        return p`
            <ha-card class="view-card" @click=${() => this._editView(s)}>
              <div class="card-header">
                <h3>${s.name}</h3>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  @click=${(r) => {
          r.stopPropagation(), this._deleteView(s);
        }}
                ></ha-icon-button>
              </div>
              <div class="card-content">
                <div class="card-meta">
                  ${((t = (e = this._config) == null ? void 0 : e.layout_types[s.layout]) == null ? void 0 : t.name) || s.layout}
                  &bull; ${((i = this._config) == null ? void 0 : i.themes[s.theme]) || s.theme}
                  &bull; ${s.widgets.length} widgets
                </div>
              </div>
            </ha-card>
          `;
      }
    )}
        <div class="add-card" @click=${this._createView}>
          <ha-icon icon="mdi:plus"></ha-icon>
          <span style="margin-left: 8px">Add View</span>
        </div>
      </div>
    `;
  }
  _renderDevicesList() {
    return this._devices.length === 0 ? p`
        <div class="empty-state">
          <ha-icon icon="mdi:monitor-off"></ha-icon>
          <p>No GeekMagic devices configured.</p>
          <p>Add a device through Settings → Devices & Services.</p>
        </div>
      ` : p`
      <div class="devices-list">
        ${this._devices.map(
      (s) => p`
            <ha-card>
              <div class="card-content" style="padding-top: 16px;">
                <div class="device-header">
                  <span class="device-name">${s.name}</span>
                  <span class="device-status ${s.online ? "online" : "offline"}">
                    ${s.online ? "Online" : "Offline"}
                  </span>
                </div>
                <div class="views-checkboxes">
                  <div class="section-title" style="margin-top: 8px;">Assigned Views</div>
                  ${this._views.length === 0 ? p`<p style="color: var(--secondary-text-color)">
                        No views available. Create a view first.
                      </p>` : this._views.map(
        (e) => p`
                          <label class="view-checkbox">
                            <ha-checkbox
                              .checked=${s.assigned_views.includes(e.id)}
                              @change=${(t) => this._toggleDeviceView(
          s,
          e.id,
          t.target.checked
        )}
                            ></ha-checkbox>
                            ${e.name}
                          </label>
                        `
      )}
                </div>
              </div>
            </ha-card>
          `
    )}
      </div>
    `;
  }
  _renderEditor() {
    var e;
    if (!this._editingView || !this._config) return d;
    const s = ((e = this._config.layout_types[this._editingView.layout]) == null ? void 0 : e.slots) || 4;
    return p`
      <div class="editor-header">
        <ha-icon-button
          .path=${"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"}
          @click=${() => this._page = "views"}
        ></ha-icon-button>
        <ha-textfield
          .value=${this._editingView.name}
          @input=${(t) => this._updateEditingView({
      name: t.target.value
    })}
          placeholder="View name"
        ></ha-textfield>
        <ha-button
          raised
          ?disabled=${this._saving}
          @click=${this._saveView}
        >
          ${this._saving ? "Saving..." : "Save"}
        </ha-button>
      </div>

      <div class="editor-container">
        <div class="editor-form">
          <div class="form-row">
            <ha-select
              label="Layout"
              .value=${this._editingView.layout}
              @selected=${(t) => {
      const i = t.detail.index, n = Object.keys(this._config.layout_types)[i];
      n && this._updateEditingView({ layout: n });
    }}
              @closed=${(t) => t.stopPropagation()}
            >
              ${Object.entries(this._config.layout_types).map(
      ([t, i]) => p`
                  <mwc-list-item value=${t}>
                    ${i.name} (${i.slots} slots)
                  </mwc-list-item>
                `
    )}
            </ha-select>
            <ha-select
              label="Theme"
              .value=${this._editingView.theme}
              @selected=${(t) => {
      const i = t.detail.index, n = Object.keys(this._config.themes)[i];
      n && this._updateEditingView({ theme: n });
    }}
              @closed=${(t) => t.stopPropagation()}
            >
              ${Object.entries(this._config.themes).map(
      ([t, i]) => p`
                  <mwc-list-item value=${t}>${i}</mwc-list-item>
                `
    )}
            </ha-select>
          </div>

          <div class="section-title">Widgets</div>
          <div class="slots-grid">
            ${Array.from(
      { length: s },
      (t, i) => this._renderSlotEditor(i)
    )}
          </div>
        </div>

        <div class="editor-preview">
          <ha-card class="preview-card">
            <div class="card-header">
              <h3>Preview</h3>
              <ha-icon-button
                .path=${"M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"}
                @click=${() => this._refreshPreview()}
              ></ha-icon-button>
            </div>
            <div class="card-content">
              ${this._previewLoading ? p`<div class="preview-placeholder">
                    <ha-circular-progress indeterminate></ha-circular-progress>
                  </div>` : this._previewImage ? p`<img
                      class="preview-image"
                      src="data:image/png;base64,${this._previewImage}"
                      alt="Preview"
                    />` : p`<div class="preview-placeholder">No preview</div>`}
            </div>
          </ha-card>
        </div>
      </div>
    `;
  }
  _renderSlotEditor(s) {
    var r;
    if (!this._config) return d;
    const e = (r = this._editingView) == null ? void 0 : r.widgets.find((n) => n.slot === s), t = (e == null ? void 0 : e.type) || "", i = this._config.widget_types[t];
    return p`
      <ha-card class="slot-card">
        <div class="card-content">
          <div class="slot-header">Slot ${s + 1}</div>

          <div class="slot-field">
            <ha-select
              label="Widget Type"
              .value=${t}
              @selected=${(n) => {
      const o = n.detail.index, a = ["", ...Object.keys(this._config.widget_types)][o] || "";
      this._updateWidget(s, { type: a });
    }}
              @closed=${(n) => n.stopPropagation()}
            >
              <mwc-list-item value="">-- Empty --</mwc-list-item>
              ${Object.entries(this._config.widget_types).map(
      ([n, o]) => p`
                  <mwc-list-item value=${n}>${o.name}</mwc-list-item>
                `
    )}
            </ha-select>
          </div>

          ${i != null && i.needs_entity ? p`
                <div class="slot-field">
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{
      entity: i.entity_domains ? { domain: i.entity_domains } : {}
    }}
                    .value=${(e == null ? void 0 : e.entity_id) || ""}
                    .label=${"Entity"}
                    @value-changed=${(n) => this._updateWidget(s, {
      entity_id: n.detail.value
    })}
                  ></ha-selector>
                </div>
              ` : d}

          <div class="slot-field">
            <ha-textfield
              label="Label (optional)"
              .value=${(e == null ? void 0 : e.label) || ""}
              @input=${(n) => this._updateWidget(s, {
      label: n.target.value
    })}
            ></ha-textfield>
          </div>
        </div>
      </ha-card>
    `;
  }
};
g.styles = ue`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      --mdc-theme-primary: var(--primary-color);
      --mdc-theme-on-primary: var(--text-primary-color);
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--app-header-background-color);
    }

    .header-title {
      font-size: 20px;
      font-weight: 400;
      margin-left: 8px;
    }

    .header-tabs {
      margin-left: auto;
      --mdc-tab-text-label-color-default: var(--primary-text-color);
    }

    .content {
      flex: 1;
      overflow: auto;
      padding: 16px;
      background: var(--primary-background-color);
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    /* Views Grid */
    .views-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    ha-card {
      --ha-card-border-radius: 12px;
    }

    .view-card {
      cursor: pointer;
    }

    .view-card:hover {
      --ha-card-background: var(--secondary-background-color);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .card-content {
      padding: 0 16px 16px;
    }

    .card-meta {
      font-size: 14px;
      color: var(--secondary-text-color);
    }

    .add-card {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
      border: 2px dashed var(--divider-color);
      border-radius: 12px;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: all 0.2s;
    }

    .add-card:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    /* Editor */
    .editor-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .editor-header ha-textfield {
      flex: 1;
    }

    .editor-container {
      display: flex;
      gap: 24px;
      height: calc(100% - 80px);
    }

    .editor-form {
      flex: 7;
      overflow-y: auto;
    }

    .editor-preview {
      flex: 3;
      min-width: 280px;
    }

    .preview-card {
      position: sticky;
      top: 0;
    }

    .preview-card .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
    }

    .preview-image {
      width: 240px;
      height: 240px;
      border-radius: 8px;
      background: #000;
      object-fit: contain;
    }

    .preview-placeholder {
      width: 240px;
      height: 240px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
    }

    /* Form Layout */
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row > * {
      flex: 1;
    }

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 24px 0 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-title:first-child {
      margin-top: 0;
    }

    /* Slots Grid */
    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .slot-card {
      --ha-card-border-radius: 8px;
    }

    .slot-card .card-content {
      padding: 16px;
    }

    .slot-header {
      font-weight: 500;
      margin-bottom: 16px;
      color: var(--primary-text-color);
    }

    .slot-field {
      margin-bottom: 16px;
    }

    .slot-field:last-child {
      margin-bottom: 0;
    }

    ha-select,
    ha-textfield {
      display: block;
      width: 100%;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    /* Devices */
    .devices-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 800px;
    }

    .device-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .device-name {
      font-size: 16px;
      font-weight: 500;
    }

    .device-status {
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
    }

    .device-status.online {
      background: var(--success-color, #4caf50);
      color: white;
    }

    .device-status.offline {
      background: var(--error-color, #f44336);
      color: white;
    }

    .views-checkboxes {
      margin-top: 16px;
    }

    .view-checkbox {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }

    .view-checkbox ha-checkbox {
      margin-right: 8px;
    }

    /* Empty states */
    .empty-state {
      text-align: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    .empty-state ha-icon {
      --mdc-icon-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `;
_([
  L({ attribute: !1 })
], g.prototype, "hass", 2);
_([
  L({ type: Boolean })
], g.prototype, "narrow", 2);
_([
  L({ attribute: !1 })
], g.prototype, "route", 2);
_([
  L({ attribute: !1 })
], g.prototype, "panel", 2);
_([
  f()
], g.prototype, "_page", 2);
_([
  f()
], g.prototype, "_config", 2);
_([
  f()
], g.prototype, "_views", 2);
_([
  f()
], g.prototype, "_devices", 2);
_([
  f()
], g.prototype, "_editingView", 2);
_([
  f()
], g.prototype, "_previewImage", 2);
_([
  f()
], g.prototype, "_previewLoading", 2);
_([
  f()
], g.prototype, "_loading", 2);
_([
  f()
], g.prototype, "_saving", 2);
g = _([
  Oe("geekmagic-panel")
], g);
export {
  g as GeekMagicPanel
};
