!Function.prototype.bind && (Function.prototype.bind = function(obj) {
    var args = new Array();
    var i;
    for (i=1;i<arguments.length;i++) {
	args.push(arguments[i]); }
    this.bound = obj;
    var that = this;
    return function() {
	var margs = args.concat();
	for (i=0;i<arguments.length;i++) {
	    margs.push(arguments[i]); }
	return that.apply(obj, margs); }});

Function.prototype.compose = function(fn) {
    return function() {
	return this(fn.apply(fn.bound || fn, arguments)); }; };

Function.prototype.reverse = function() {
    var that = this;
    return function() {
	return !that.apply(that.bound || that, arguments); }; };

Array.prototype.assoc_all = function(val) {
    var i; var ar = new Array();
    for (i=0;i<this.length;i++) {
	if (this[i][0] == val) {
	    ar.push(this[i]); }}
    return ar; }

Array.prototype.not_empty = function() {
    return this.length > 0; }

Array.prototype.empty = function() {
    return this.length === 0; }

Array.prototype.getLast = Array.prototype.last = function() {
    return this[this.length - 1]; }
Array.prototype.first = function() {
    return this[0]; }
Array.prototype.areIn = Array.prototype.are_in = function(ar) {
    var i; var j; var done;
    for (i=0;i<ar.length;i++) {
	done = false;
	for (j=0;j<this.length && !done;j++) {
	    if (ar[i] == this[j]) {
		done = true; }}
	if (!done) { return false; }}
    return true; }

Array.prototype.member = function(val) {
    var i; 
    for (i=0;i<this.length;i++) {
	if (val == this[i]) { return true; }}
    return false; }

!String.prototype.each && (String.prototype.each = function(fn) {
    var i;
    for (i=0;i<this.length;i++) {
	fn(this[i]); }});

Array.prototype.each = (Array.prototype.each || (Array.prototype.map ? Array.prototype.map :
						 function(fn) {
						     var i;
						     for (i = 0; i < this.length; i++) {
							 fn(this[i]); }}));

!Array.prototype.map && (Array.prototype.map = function(fn) {
    var ar = new Array();
    var i;
    for (i=0;i<this.length;i++) {
	ar.push(fn(this[i])); }
    return ar; });

!Array.prototype.reduce && (Array.prototype.reduce = function(fn,init) {
    var i;
    for (i=0;i<this.length;i++) {
	init = fn(init, this[i]); }
    return init; });

Array.prototype.reduce_right = function (fn,init) {
    var i;
    for (i=0;i<this.length;i++) {
	init = fn(this[i], init); }
    return init; }

!Array.prototype.filter && (Array.prototype.filter = function (fn) {
    var ar = new Array();
    var i;
    for (i=0; i < this.length; i++) {
	if (fn(this[i])) {
	    ar.push(this[i]); }}
    return ar; });

Array.prototype.filter_except = function(fn) {
    return this.filter(fn.reverse()); }

Array.prototype.assoc = function(val) {
    var i;
    for (i=0;i<this.length;i++) {
	if (this[i][0] == val) {
	    return this[i]; }}
    return false; }

Array.prototype.replace = function(who, wit) {
    var pos = me.indexOf(who);
    return me.slice(0, pos).concat(wit).concat(me.slice(pos+1)); }

Array.prototype.preceding = function(el) {
    var i = this.indexOf(el);
    if (i == 0) { return false; }
    else { return this[i-1]; }}

Array.prototype.following = function(el) {
    var i = this.indexOf(el);
    if (i == this.length - 1) { return false; }
    else { return this[i+1]; }};

function object_prototype(name, fn) {
    Object.defineProperty(Object.prototype, name, {
	    value: fn}); }

object_prototype( "descend", function(too) {
    var newo = {};
    for (i in this) {
	newo[i] = this[i]; }
    for (i in too) {
	newo[i] = too[i]; }
    return newo; });

object_prototype("to_array", function() {
    var i; var ar = []; 
    for (i=0;i<this.length;i++) {
	ar.push(this[i]); }
    return ar; });

Function.prototype.delay = function() {
    var args = W.to_array(arguments);
    var that = this;
    return function() {
	var as = args.concat(W.to_array(arguments));
	return that.apply(that.bound || that, as); }};

Number.prototype.ceil = function() {
    return this.floor() + 1; }
Number.prototype.floor = function() {
    return this - (this % 1); }


function w_namespace() {
    var W = {};
    var element_names = new Array();
    W.extend_element = function(name, fn) {
	element_names.push([name, fn]); }
    var ex = W.extend_element;
    ex('set_value', function(x) {
	this.value = x;
	return this; });
    ex('add_listener', function(on, listen) {
	this.events.push([on,listen]);
	return this; });
    ex('remove_listener', function(on, listener) {
	this.events = this.events.filter(function(x) {
	    return (!on || x[0] == on) && (!listener || x[1] == listener); }); });
    ex('fire', function(event) {
	if (this.events.empty()) { return; }
	var name;
	if (typeof event === "string") {
	    name = event;
	    event = arguments[1] || name;
	    event.name = name; }
	else {
	    name = event.name; }
	(this.debugging && this.events.assoc_all(name).not_empty()) && alert(name);
	this.events.assoc_all(name).each(function(e) { e[1](event); });
	return this; });
    ex('replace_child', function(who, wit) {
	var pointer = who.nextSibling;
	this.remove_child(who);
	this.insert_before(wit, pointer);
	return this; });
    ex('insert_before', function(who, bef) {
	this.insertBefore(who, bef);
	return this; });
    ex('new_child', function(tag, classes, innerHTML) {
	var cc = W.wyjify(document.createElement(tag));
	classes && cc.set_classes(classes);
	innerHTML && (cc.innerHTML = innerHTML);
	this.appendChild(cc);
	return cc; });
    ex('append_child', function(c) {
	this.appenChild(c);
	return this; });
    ex('remove_child', function(c) {
	this.removeChild(c);
	return this; });
    ex('add_class', function(c) {
	var cs = this.className.split(' ');
	this.className = cs.filter_except(tester(c)).concat(c).join(' ');
	return this; });
    ex('remove_class', function(c) {
	var cs = this.className.split(' ');
	this.className = cs.filter_except(tester(c)).join(' ');
	return this; });
    ex('get_classes', function() {
	return this.className.split(' '); });
    ex('clear_classes', function() {
	this.className = "";
	return this; });
    ex('set_classes', function(cs) {
	if (typeof cs === "string") { this.className = cs; return; }
	this.className = cs.join(' ');
	return this; });
    ex('set', function() {
	var i;
	if (typeof arguments[0] !== "string") {
	    for (i=0;i<arguments.length;i++) {
		this.setAttribute(arguments[i][0], arguments[i][1]); }}
	else {
	    this.setAttribute(arguments[0], arguments[1]); }
	return this; });
    ex('get', function(att) {
	return this[att]; });
    ex('add_method', function(name, fn) {
	this[name] = fn.bind(this);
	return this; });
    ex('get_width', function() {
	return this.offsetWidth; });
    ex('get_height', function() {
	return this.offsetHeight; });
    ex('from_top_left', function() {
	var left = 0;
	var top = 0;
	if (this.offsetParent) {
	    var pp = W.wyjify(this.offsetParent).from_top_left();
	    left = this.offsetLeft + pp[0];
	    top = this.offsetTop + pp[1]; }
	return [left,top]; });
    ex('append_child', function(c) {
	this.appendChild(c);
	return this; });
    ex('duplicate', function() {
	return W.wyjify(this.element.cloneNode(true)); });
    W.wyjify = function(me) {
	// Fucking Safari...
	if (me.wyjified) {
	    return me; }
	element_names.each(function(el) {
	    window.status = el[0];
	    me[el[0]] = el[1].bind(me); });
 	me.events = new Array();
	me.wyjified = true;
	function make_listener(name) {
	    return function(e) {
		e = e || window.event;
		e.name = name;
		return me.fire(e); }; }
	function add_listener(name) {
	    me.addEventListener(name, make_listener(name), false);
	    return me; }
	['click', 'mouseover', 'mouseup', 'mousedown', 'mousemove', 'keypress', 'keyup', 'keydown', 'focus', 'blur'].each(add_listener);
	return me; }
    W.win = W.wyjify(window);
    W.doc = W.wyjify(document);
    W.doc.new_unbound_child = function(tag, classes, innerHTML) {
	var cc = W.wyjify(document.createElement(tag));
	classes && cc.set_classes(classes);
	innerHTML && (cc.innerHTML = innerHTML);
	return cc; };
    W.new_dnd = function() {
	var me = {};
	var handles = container();
	var targets = container();
	var handle = false;
	function outliner(o) {
	    return function(e) {
		handle = o;
		o.fire('pickup', {'controller' : me});
		var outline = new_element('div', 'outline');
		outline.style.width = o.clientWidth;
		outline.style.height = o.clientHeight;
		outline.style.position = fixed;
		outline.move_to(e.position(), 'centered');
		function onmousemove(e) {
		    outline.move_to(e.position(), 'centered'); }
		function onmouseup(e) {
		    document.removeChild(outline);
		    document.remove_listener('mousemove', onmousemove);
		    document.remove_listener('mouseup', onmouseup);
		    handle = false; }
		document.add_listener('mousemove', onmousemove);
		document.add_listener('mouseup', 'mouseup'); }; }
	me.add_handle = function(o) {
	    handles.add(o);
	    o.dragging = false;
	    o.add_listener('mousedown', outliner(o)); }
	function onhover(o) {
	    o.fire('hover', {'controller' : me, 'handle' : handle, 'event' : event});
	    function mouseup(e) {
		o.fire('drop', {'controller' : me, 'handle' : handle, 'event' : event}); }
	    function mouseout(e) {
		o.fire('mouseout', {'controller' : me, 'handle' : handle, 'event' : event});
		o.remove_listener('mouseup', mouseup);
		o.remove_listener('mouseout', mouseout); }
	    o.add_listener('mouseup', mouseup);
	    o.add_listener('mouseout', mouseout); }
	me.add_target = function(o) {
	    targets.add(o);
	    o.add_listener('mouseover', onhover(o)); }
	return me; }
    W.new_selector = function(multiplep) {
	var me = {};
	var options = container();
	me.add_option = function(o, selectedp) {
	    options.add(o);
	    o.add_listener('click', function() {
		if (!o.selected) {
		    me.select(o); }
		else {
		    me.deselect(o); }});
	    selectedp ? me.select(o) : me.deselect(o); };
	me.select = function(o) {
	    !multiplep && me.deselect_all();
	    o.selected = true;
	    o.fire('select', {'selector' : me}); };
	me.deselect = function(o) {
	    o.selected = false;
	    o.fire('deselect', {'selector' : me}); };
	me.deselect_all = function() {
	    options.each(me.deselect); }
	me.get_selected = function() {
	    return options.matching(taker('selected')); };
	return me; }
    W.new_container = function(ar) {
	ar = ar || new Array();
	var me = {};
	me.add = function(a) {
	    if (!ar.member(a)) { ar.push(a); }};
	me.remove = function(a) {
	    ar = ar.filter(tester(a)); };
	me.matching = function(fn) {
	    return ar.filter(fn); };
	me.filter = function(fn) {
	    ar = ar.filter(fn); }
	me.filter_except = function (fn) {
	    ar = ar.filter_except(fn); }
	me.clear = function() { ar = new Array(); }
	me.set = function(a) { ar = a; }
	me.get = function() { return ar; }
	me.each = function(f) { return ar.each(f); }
	me.map = function(f) { return ar.map(f); }
	me.not_matching = ar.filter_except;
	return me; }
    W.new_element = function(type, klass, p, iHTML) {
	var o = W.wyjify(document.createElement(type));
	o.className = klass || ""; 
	p && p.appendChild(o);
	iHTML && (o.innerHTML = iHTML);
	return o; }
    W.range = function(s, e) {
	var ar = new Array();
	for (s=s;s<=e;s++) {
	    ar.push(s); }
	return ar; }
    W.tester = function(value) {
	return function(test) {
	    return test === value; }}
    W.attr_tester = function(attr, value) {
	return function(test) {
	    return test[attr] === value; }}
    W.string_append = function(s1,s2) {
	return s1 + s2; }
    W.take = function(o, name) {
	return o[name]; }
    W.taker = function(name) {
	return function(o) { return o[name]; }}
    W.teller = function(name) {
	return function(o) { return o[name](); }}
    W.array_concat = function(a1, a2) {
	return a1.concat(a2); }
    W.new_incrementor = function(x) {
	return function(y) {
	    if (y) { x = (x > y ? x : y); return x; }
	    return x++; }};
    W.make_event = function(fn) {
	return function(e) {
	    e.cancelBubble = true;
	    e.returnValue=false;
	    if (e.stopPropagation) e.stopPropagation();
	    if (e.preventDefault) e.preventDefault();
	    fn(e); }}
    W.by_id = function(id) {
	return W.wyjify(document.getElementById(id)); }
    W.lowest = function() {
	var l = arguments[0];
	var i;
	for (i=1;i<arguments.length;i++) {
	    if (arguments[i] < l) { l = arguments[i]; }}
	return l; };
    W.new_event = function(name, target) {
	var e = {'event_data' : {'event_name' : name, 'event_target' : target}};
	return e; };
    W.to_array = function(what) {
	return Object.prototype.to_array.bind(what)(); };
    return W; }

var W = w_namespace();

function in_popup(e) {
    var x = W.new_element('div', 'popup');
    x.appendChild(e);
    x.addEventListener('click', function() {unpop_up(x); }, false);
    return x; }

function flash(text, n) {
    n = n || 5000;
    var e = W.new_element('p');
    e.innerHTML=text;
    e = in_popup(e);
    pop_up(e);
    setTimeout(function() {unpop_up(e)}, n); }

function alert(text) {
    var e = W.new_element('div');
    var e2 = in_popup(e);
    e.new_child('p','', text);
    var close = unpop_up.delay(e2);
    e.new_child('a','popup-button','OK').add_listener('click', close);
    pop_up(e2); }

function integer_input(range, name, value) {
    var range = (range ? range.split('-') : ['','']);
    var input = W.new_element('input', 'integer');
    register_input(input);
    input.name = name || '';
    if (value && value !== '') {
	input.value = value; }
    else {
	if (range[0] != '') { input.value = range[0]; value = range[0]; }
	else { input.value = 0; value = 0; }}
    function name_n(n, x) {
	if (n === '') {
	    return (x === 0 ? 'Negative' : 'Positive') + ' infinity'; }
	else {
	    return n; }}
    input.addEventListener('change', function(e) {
	if (!input.value.match(/^-?[0-9]+$/)) {
	    input.value = value;
	    flash('Value must be a number between '+name_n(range[0], 0)+' and '+name_n(range[1], 1)+'.'); }
	else {
	    if ((range[0] !== '' && Number(input.value) < range[0]) ||
		(range[1] !== '' && Number(input.value) > range[1])) {
		flash('Value must be a number between '+name_n(range[0])+' and '+name_n(range[1])+'.'); 
		input.value = (range[0] !== '' ? range[0] : (range[1] !== '' ? range[1] : 0)); }
	    else {
		value = input.value; }}}, false);
    return input; }

function size_input(range, name, value) {
    name = name || '';
    value = value || [0, "px"];
    range = range || '-';
    var inter = integer_input(range, name+'-integer', value[0]);
    function update_value(x) {
	unitholder.value = x;
	value[1] = x; }
    var unit = widget_drop_down(value[1], ['px', '%', 'em', 'pt', 'in', 'cm'], 
	update_value);
    var holder = W.new_element('div', 'size-input');
    var ari = holder.new_child('div', 'aroundinput');
    var unitholder = holder.new_child('input');
    unitholder.type = 'hidden';
    unitholder.name = name+'-unit';
    unitholder.value = value[1];
    ari.appendChild(inter);
    holder.appendChild(unit.element); 
    return holder; }

function prompt(action, message, form) {
    var div = W.new_element('div', 'popup');
    div.new_child('p').innerHTML = message;
    var form = make_form(div, action, 'post', form);
    pop_up(div); }

var popup_master_el = W.new_element('div', 'popupc');
var popupevent = false;
function pop_up(el) {
    document.body.appendChild(popup_master_el);
    popupevent && popup_master_el.removeEventListener('click', popupevent, false);
    popupevent = function() {unpop_up(el); };
    popup_master_el.addEventListener('click', popupevent , false); 
    el.style.position="fixed";
    el.style.width="66%";
    el.style.left="18%";
    el.style.top="10%";
    document.body.appendChild(el); }

function unpop_up(el) {
    on_unfocus();
    document.body.removeChild(el);
    document.body.removeChild(popup_master_el); }

function confirm(message, fn) {
    var pel = W.new_element('div', 'popup');
    var p = pel.new_child('p', 'center');
    p.innerHTML = message;
    var optel = pel.new_child('div', 'center');
    var yes = widget_a(function() {fn(); unpop_up(pel); }, 'Yes', 'popup-button');
    var no = widget_a(function() {unpop_up(pel);}, 'No', 'popup-button');
    optel.appendChild(yes.element);
    optel.appendChild(no.element);
    pop_up(pel); }

function url_redirector(url) {
    return function() { window.location = url; }}
var sender = url_redirector;

function forge_key(c) {
    var k = c.charCodeAt(0);
    if (c == "\n") { k = 13; }
    if (c == "\t") { k = 9; }
    var e = {charCode : k};
    doc.on_key(e); }

function get_clipboard(event) {
    var text;
    if (window.clipboardData) {
	event(window.clipboardData.getData("Text")); }
    else {
	var div = document.createElement('div');
	div.className = 'popup';
	var p1 = W.new_element("p", "", div);
	p1.innerHTML = "Sorry, for security reasons, your browser won't let us paste text from your clipboard";
	var p2 = W.new_element("p", "", div);
	p2.innerHTML = "To paste text into your document, paste into the text box below and hit \"Go\"";
	var frm = W.new_element("form", "", div);
	var textarea = new_textarea(frm);
	var submit = W.new_element("input", "", frm);
	submit.setAttribute("type", "submit");
	submit.setAttribute("value", "Go");
	frm.addEventListener("submit", function() {event(textarea.value);unpop_up(div); }, false);
	pop_up(div); }}

function new_textarea(p, c) {
    var t = W.new_element("textarea", (c || ""), p);
    t.addEventListener("focus",on_focus(t), false);
    t.addEventListener("blur",on_unfocus(t), false);
    return t; }

function register_input(i) {
    i.addEventListener("focus", on_focus(i), false);
    i.addEventListener("blur", on_unfocus(i), false);
    return i; }

var focus = false;
function on_focus(what) {
    return make_event(function() {
	focus = what; });}
function on_unfocus(what) {
    return make_event(function() {
	focus = false; });}

Array.prototype.rest = function() {
    return this.slice(1); }

function onloader() {
    var onload = new Array();
    function add_onload(fn) {
	onload.push(fn); }
    function run() {
	onload.map(function (fn) {fn.call(fn); }); }
    return {'add' : add_onload, 'run' : run}; }

Array.prototype.max = function() {
    var m = this[0];;
    for (i = 0; i < this.length; i++) {
	if (this[i] > m) { m = this[i]; }}
    return m; }

W.form_inputs = [];
W.form_inputs["action"] = function(row, form) {
    var a = widget_a(sender(row.url), row.title, 'form-link');
    row.holder.appendChild(a.element); };
W.form_inputs["drop-down"] = function(row, form) {
    var i = row.holder.new_child("input", 'hidden').set(['type', 'hidden'],
	['name', row.name],
	['value', row.value]);
    var d = widget_drop_down(row.value, row.options, i.set_value);
    row.holder.append_child(d.element); };
W.form_inputs["integer"] = function(row, form) {
    //    var ai = row.holder. /// FINISH
	};
W.make_form = function(inn, action, method, data) {
    var form = new_element('form', '', inn);
    form.set(['action', action], ['method', method]);
    var onsubmits = new Array();
    var of = new Array();
    function on_finish(x) { of.push(x); }
    function add_submit_method(fn) {
        onsubmits.push(fn); }
    form.addEventListener('submit', function() { onsubmits.map(function(f) { f.call(f); }); }, false);
    data.each(function (row) {
        var input_holder; var input_sender;
        var label = (row.label ? row.label+':' : '&nbsp;');
        var type = row.type || 'text';
        var value = row.value || '';
        var name = row.name || '';
        var rowe = form.new_child('div', 'row');
        if (row.in_element) {rowe.className = "collapsed"; }
        rowe.new_child('div', 'label').innerHTML = label;
        row.holder = rowe.new_child('div', (type === 'wrytyr' ? 'input expand' : 'input'));
        function update_sender() { // Originally in "layout", Safari doesn't seem to like fn definition inside switch
          input_sender.value = selector.get_selected().map(taker('gid')).toSource(); }
	if (W.form_inputs[type]) {
	    W.form_inputs[type](this_form); }
	else {
	    W.error('invalid input type', {}); }
        switch (type) {
        case "action":
            var a = widget_a(sender(row.url), row.title, 'form-link');
            inpute.appendChild(a.element);
            break;
        case "drop-down":
            var i = inpute.new_child('input', 'hidden')
            i.type = 'hidden';
            i.name = row.name;
            i.value = row.value;
            var d = widget_drop_down(row.value, row.options, i.set_value);
            inpute.appendChild(d.element); 
            break;
        case "integer":
            inpute = inpute.new_child('span', 'aroundinput');
            var integer = integer_input(row.range, name, value);
            inpute.appendChild(integer);
            break;
        case "text":
            inpute = inpute.new_child('span', 'aroundinput');
            inpute = inpute.new_child('input', 'text').set(
                ['type', 'text'],
                ['name', name],
                ['value', value]); 
            register_input(inpute);
            break;
        case "radio":
            row.options.map(function(opt) {
                var label = inpute.new_child('label');
                label.innerHTML = opt.label;
                var input = inpute.new_child('input', 'radio');
                input.type = 'radio'; input.value = value;
                input.name = name;
                if (opt.trigger) {
                    if (opt.trigger.show) {
                        fn = function() {
                            var el = document.getElementById(opt.trigger.show);
                            var pel = el.parentNode;
                            el.style.display = "block";
                            (pel.className === "aroundinput") && (pel.style.display = "block");
                            row.options.filter_except(tester(opt)).map(function(o) {
                                if (o.trigger) {
                                    var el = document.getElementById(o.trigger.show);
                                    var pel = el.parentNode;
                                    el.style.display = "none";
                                    (pel.className === "aroundinput") && (pel.style.display = "none");}}); }
                        input.add_listener('click', fn); }}
                if (value === opt.value) {
                    input.checked = true;
                    on_finish(function() {input.fire('click');}); }});
            break;
        case "layout":
            if (row.in_element) {
                inpute = by_id(row.in_element).new_child('div'); }
            else {
                inpute = inpute.new_child('div'); }
            inpute.id = name;
            input_sender = rowe.new_child('input').set(['type', 'hidden'], ['name', name], ['value', value]);
            if (row.showfirst) {
                inpute.new_child('div', '', row.showfirst); }
            var holderel = new_element('div', 'select-one', inpute);
            var selector = new_selector(true);
            row.grids.map(function(grid) {
                var id = grid[0]; 
                var el = new_element('div', 'selector grids', holderel, grid[1]);
                el.gid = id;
                el.add_listener('select', function() {
                    update_sender();
                    el.add_class('selected'); 
                    el.remove_class('deselected'); });
                el.add_listener('deselect', function() {
                    update_sender();
                    el.add_class('deselected');
                    el.remove_class('selected'); });
                selector.add_option(el, (value && value.member(id))); });
            if (row.hidden) {
                inpute.style.display = "none"; }
            break;
        case "wrytyr":
            if (row.in_element) {
                wrytyr_controls(by_id(row.in_element));
                inpute = by_id(row.in_element).new_child('div', 'aroundinput wrytyr'); }
            else {
                wrytyr_controls(inpute);
                inpute = inpute.new_child('div', 'aroundinput wrytyr'); }
            input_holder = inpute.new_child('div', 'docholder'); 
            input_holder.id = name;
            input_sender = rowe.new_child('input').set(['type', 'hidden'], ['name', name], ['value', value]);
            if (row.hidden) {
                inpute.style.display = "none";
                input_holder.style.display = "none"; }
            var doc = (value === '' ? empty_document(input_holder) : decompile_document(input_holder, value));
            add_submit_method(function() { input_sender.value = compile_doc(); });
            break;
        case "tags":
            input_holder = inpute.new_child('div', 'tagholder'); 
            input_sender = inpute.new_child('input').set(['type', 'hidden'], ['name', name], ['value', value]);
            var tags = new_tagslist(input_holder, (value === '' ? undefined : value));
            add_submit_method(function() { input_sender.value = tags.serialize(); });
            break;
        case "submit":
            var submit = inpute.new_child('input', 'submit').set(['type', 'submit'], ['name', name], ['value', value]);
            if (row.inferior) {
                inpute.new_child('input', 'submit inferior').set(['name', name], ['type', 'submit'], ['value', row.inferior]); }
            break; }});
    of.map(teller('call')); }

W.pattern = function(pattern, r) {
    r = W.new_template(r);
    W.patterns[pattern[0]].apply(W.patterns, [r.register].append(pattern.slice(1))); };
W.patterns = [];
W.define_pattern = function(name, fn) {
    W.patterns[name] = fn; }
W.define_tag = function(name) {
    W.define_pattern(name, function(register_name) {
	var opt = {};
	var children;
	if (arguments[1] instanceof Array) {
	    children = W.to_array(arguments).slice(1); }
	else {
	    opt = arguments[1];
	    children = W.to_array(arguments).slice(2); }
	var o = W.new_element(name);
	for (var x in opt) {
	    o.set(x, opt[x]); }
	if (opt.name) { register_name(name, o); }
	children.each(function(c) {
	    W.patterns[c].apply(W.patterns, [register_name].append(c.slice(1))); }); }); };
['html', 'head', 'body', 'div', 'span', 'table', 'td', 'tr', 'th', 'ul', 'ol', 'li', 'dl', 'dd', 'dt', 'b', 'i', 'u', 'strong', 'em', 'small', 'big', 'sub', 'sup', 'del', 'form', 'input', 'legend', 'select', 'option', 'textarea', 'buttom', 'img', 'fieldset'].each(W.define_tag); 
	    
//W.build_pattern(['div', {}, children...]);
var onloads = onloader();
var add_onloader = onloads.add;

