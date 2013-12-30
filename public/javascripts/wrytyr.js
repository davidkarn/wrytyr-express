
C = false;

function fixed_unit(distance) {
    return (['pt', 'in', 'cm'].member(distance.unit)); }

get_text_dimensions = function(text, font) {
    var body = document.getElementsByTagName("body")[0];
    var dummy = document.createElement("span");
    dummy.appendChild(document.createTextNode(text));
    dummy.setAttribute("style", "margin: 0; visibility: hidden; padding: 0; line-height: 1; font: " + font + ";");
    body.appendChild(dummy);
    var rect = dummy.getClientRects()[0];
    body.removeChild(dummy);
    return rect; };

init_canvas = function(C, doc) {
    C.page_width = (0.84 * C.width).ceil();
    C.doc = doc;
    C.inch = (C.page_width / C.doc.paper_width.distance);
    C.point = C.inch / 72;
    C.page_height = C.inch * C.doc.paper_height.distance;
    C.fixed_unit_table = {'in': C.inch,
			  'pt': C.point};
    C.margin = (C.width - C.page_width) / 2;

    C.draw_page = function() {
	var context = C.getContext('2d');
	context.fillStyle = 'white';
	context.fillRect(C.margin, C.margin, C.page_width, C.page_height); }

    C.draw_rulers = function() {
	var context = C.getContext('2d');
	context.fillStyle = "#282828";
	var lengths = {inch: 0.22,
		   half_inch: 0.18,
		   quarter_inch: 0.16,
		   eigth_inch: 0.12,
		   sixteenth_inch: 0.08};
	
	for (var j = 0; j <= 1; j++) {
	    var i = -1;
	    var unit = false;
	    var y = C.margin * 0.4;
	    for (x = C.margin; x < (j == 0 ? C.width - C.margin : C.height); x += (C.inch / 16)) {
		i++;
		var width = (C.inch / (72 * 3));
		if (i % 16 == 0) { unit = 'inch'; }
		else if (i % 8 == 0) { unit = 'half_inch'; }
		else if (i % 4 == 0) { unit = 'quarter_inch'; }
		else if (i % 2 == 0) { unit = 'eigth_inch'; }
		else { unit = 'sixteenth_inch'; }
		if (j == 0) {
		    context.fillRect(x, y, width, C.margin * lengths[unit]); }
		else {
		    context.fillRect(y, x, C.margin * lengths[unit], width); }}}}

    C.draw_dotted_line_hor = function(x_start, y, length, thickness, dash_size, color) {
	var context = C.getContext('2d');
	context.fillStyle = color || "#282828";
	dash_size = dash_size || C.point * 4;
	thickness = thickness || C.point * 2;
	
	for (var x = x_start; x < (x_start + length); x += (dash_size * 2)) {
	    context.fillRect(x, y, dash_size, thickness); }}

    C.draw_dotted_line_vert = function(x, y_start, length, thickness, dash_size, color) {
	var context = C.getContext('2d');
	context.fillStyle = color || "#282828";
	dash_size = dash_size || C.point * 4;
	thickness = thickness || C.point * 2;
	
	for (var y = y_start; y < (y_start + length); y += (dash_size * 2)) {
	    context.fillRect(x, y, thickness, dash_size); }}

    C.draw_margins = function() {
	C.draw_dotted_line_hor(0, C.margin + C.calc_fixed_distance(C.doc.margin_top),
			       C.width, C.point / 3, false, "#EE9999"); 
	C.draw_dotted_line_hor(0, C.margin + C.page_height - C.calc_fixed_distance(C.doc.margin_bottom),
			       C.width, C.point / 3, false, "#EE9999"); 
	C.draw_dotted_line_vert(C.margin + C.calc_fixed_distance(C.doc.margin_left), 0,
				C.height, C.point / 3, false, "#EE9999"); 
	C.draw_dotted_line_vert(C.margin + C.page_width - C.calc_fixed_distance(C.doc.margin_right), 0,
				C.height, C.point / 3, false, "#EE9999"); }

    C.draw_doc = function() {
	var start_y = false;
	for (block in C.doc.body) {
	    start_y = C.draw_block(C.doc.body[block], false, start_y).y; }}

    C.draw_block = function(block, start_x, start_y, end_x, end_y) {
	start_x = start_x || C.margin + C.calc_fixed_distance(C.doc.margin_top);
	start_y = start_y || C.margin + C.calc_fixed_distance(C.doc.margin_left);
	end_x = end_x || C.width - C.margin - C.calc_fixed_distance(C.doc.margin_bottom);
	end_y = end_y || C.height - C.margin - C.calc_fixed_distance(C.doc.margin_right);

	var style = C.style_for(block);
	var font_size = C.font_size_for(block);
	
	var context = C.getContext('2d');
	context.textBaseline="top"; 
	context.font = "" + font_size + "px " + style.font; 
	context.fillStyle = style.font_color; 
	
	return C.draw_block_body(block, 
			      start_x + C.calc_distance(style.margin_left, font_size) 
			      + C.calc_distance(style.padding_left, font_size),
			      start_y + C.calc_distance(style.margin_top, font_size) 
			      + C.calc_distance(style.padding_top, font_size),
			      end_x - C.calc_distance(style.margin_right, font_size) 
			      - C.calc_distance(style.padding_right, font_size),
			      end_y - C.calc_distance(style.margin_bottom, font_size) 
			      - C.calc_distance(style.padding_bottom, font_size), context, style, font_size); }

    C.draw_block_body = function(block, start_x, start_y, end_x, end_y, context, style, font_size) {
	var words = [];
	var height = 0;
	if (!block.body) { return {y: start_y};}
	for (var i = 0; i < block.body.length; i++) {
	    var word = block.body[i];
	    if (typeof word == "string") {
		var bounds = get_text_dimensions(word, context.font);
		height = [height, bounds.height].max(); 
		words.push({word: word, width: bounds.width}); }}

	var line_width = end_x - start_x; 
	var lines = [[]];
	var line = 0;
	var text_indent = (['left', 'justified'].member(style.align) ?
			   C.calc_distance(style.text_indent, font_size)
			   : 0);
	var line_pos = text_indent;
	var word_space = C.calc_distance(style.word_spacing, font_size);
	for (var i = 0; i < words.length; i++) {
	    var word = words[i];
	    if (line_pos + word.width > line_width) {
		line++;
		lines[line] = [word];
		line_pos = 0; }
	    else {
		lines[line].push(word); }
	    line_pos += word.width + word_space; }

	var y = start_y;
	var word_spacing = word_space;
	for (var i = 0; i < lines.length; i++) {
	    var line = lines[i];
	    var words_width = line.map(function(word) { return word.width; })
		.reduce(function(a,b) { return a + b; });

	    var offset = start_x + // TODO: make this make more sense...
		(style.align != "center"
			  ? (style.align == "right" 
			     ? (line_width - (words_width + 
					      (word_spacing * (line.length - 1)))) //right
			     : (i == 0 ? text_indent : 0)) // left & justified
		 : (line_width - (words_width + (word_spacing * (line.length - 1)))) / 2); // center

	    if (style.align == "justified" && i != (lines.length - 1)) {
		word_spacing = (line_width - words_width - 
				(i == 0 ? text_indent : 0)) / (line.length - 1); }

	    for (var w = 0; w < line.length; w++) {
		var word = line[w];
		context.fillText(word.word, offset, y);
		offset += word.width + word_spacing; }

	    y += height * style.leading; }
		
	y += C.calc_distance(style.margin_bottom, font_size) + C.calc_distance(style.padding_bottom, font_size);
	return {y: y}}

    C.block_type_style = function (blocktype) {
	return C.doc.theme.styles[blocktype] || {}; };

    C.style_for = function (block) {
	return C.doc.theme.root_style.descend(C.block_type_style(block.type))
	.descend(block.style || {}); };

    C.font_size_for = function(block) {
	return C.font_size_for_chain([block.style,
				      C.block_type_style(block.type),
				      C.doc.theme.root_style]); }

    C.font_size_for_chain = function(chain) {
	if (chain[0] && chain[0].font_size && fixed_unit(chain[0].font_size)) {
	    return C.calc_fixed_distance(chain[0].font_size); }
	else if (chain[0] && chain[0].font_size) {
	    return C.ems_to_fixed(C.font_size, C.font_size_for_chain(chain.rest())); }
	else {
	    return C.font_size_for_chain(chain.rest()); }}

    C.calc_distance = function(distance, current_font_size) {
	if (fixed_unit(distance)) {
	    return C.calc_fixed_distance(distance); }
	else {
	    return C.ems_to_fixed(distance, current_font_size); }}

    C.calc_fixed_distance = function(distance) {
	return C.fixed_unit_table[distance.unit] * distance.distance; }

    C.ems_to_fixed = function(distance, current_font_size) {
	return distance.distance * current_font_size; };

    C.draw_page(); 
    C.draw_rulers();
    C.draw_margins();
    C.draw_doc(); 

    return C; };

