
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Mixed = Schema.Types.Mixed;
//var String = Schema.Types.String;
//var Number = Schema.Types.Number;

var theme_schema = new Schema({
    root_style: ObjectId,
    name: String,
    styles: [ObjectId]});

var document_schema = new Schema({
    margin_top: Mixed,
    margin_left: Mixed,
    margin_right: Mixed,
    margin_bottom: Mixed,
    paper_width: Mixed,
    paper_height: Mixed,
    theme: ObjectId,
    body: [Mixed]});

var style_schema = new Schema({
    align: String,
    font: String,
    font_color: String,
    text_indent: Mixed,
    margin_left: Mixed,
    margin_top: Mixed,
    margin_right: Mixed,
    margin_bottom: Mixed,
    padding_left: Mixed,
    padding_top: Mixed,
    padding_right: Mixed,
    padding_bottom: Mixed,
    word_spacing: Mixed,
    sentence_spacing: Mixed,
    leading: Number,
    tracking: Number,
    ligatures: Boolean,
    font_size: Mixed,
    text_style: {
	smallcaps: Boolean,
	allcaps: Boolean,
	bold: Boolean,
	italicized: Boolean,
	underlined: Boolean,
	strikethrough: Boolean,
	subscript: Boolean,
	superscript: Boolean},
    baseline_shift: Mixed,
    scale_vertical: Number,
    scale_horizantal: Number});

var Style = mongoose.model('Style', style_schema);
var Document = mongoose.model('Document', document_schema);
var Theme = mongoose.model('Theme', theme_schema);

root_style = new Style({
    align: "left",
    font: "Georgia",
    font_color: "#ff3333",
    text_indent: {distance: 1, unit: 'em'},
    margin_left: {distance: 0, unit: 'em'},
    margin_top: {distance: 0, unit: 'em'},
    margin_right: {distance: 0, unit: 'em'},
    margin_bottom: {distance: 1, unit: 'em'},
    padding_left: {distance: 0, unit: 'em'},
    padding_top: {distance: 0, unit: 'em'},
    padding_right: {distance: 0, unit: 'em'},
    padding_bottom: {distance: 0, unit: 'em'},
    word_spacing: {distance: 0.22, unit: 'em'},
    sentence_spacing: {distance: 0.28, unit: 'em'},
    leading: 1.6,
    tracking: 0,
    ligatures: true,
    font_size: {distance: 14, unit: 'pt'},
    text_style: {
	smallcaps: false,
	allcaps: false,
	bold: false,
	italicized: false,
	underlined: false,
	strikethrough: false,
	subscript: false,
	superscript: false},
    baseline_shift: {distance: 0, unit: 'pt'},
    scale_vertical: 100,
    scale_horizantal: 100});

style_two = new Style({text_indent: {distance: 1, unit: 'em'},
		       font_color: "#111111",
		       font_size: {distance: 18, unit: 'pt'}});

var theme = new Theme({
    root_style: root_style._id,
    name: "Default Theme ",
    styles: [style_two._id]});


document = new Document({
    margin_top: {distance: 0.75, unit: 'in'},
    margin_left: {distance: 0.75, unit: 'in'},
    margin_right: {distance: 0.75, unit: 'in'},
    margin_bottom: {distance: 0.75, unit: 'in'},
    paper_width: {distance: 8.5, unit: 'in'},
    paper_height: {distance: 11, unit: 'in'},
    theme: theme._id,
    body: [
	{type: 'heading',
	 body: ["This", "is", "a", {type: 'italics', body: ["Heading"]},
		"I've", "noticed", "that", "the", "caches", "sometimes", "don't", "eet", "cleared", "out", "rieht", "awae.", "Try", "restarting", "the", "meteor", "server,", "and", "flushing", "the", "client", "browser", "history.", "Deleting", "the", ".meteor/local/build", "directory", "also", "sometimes", "helps.", "Moral", "of", "the", "story:", "removing", "a", "package", "is", "an", "expensive", "event,", "and", "requires", "some", "extra", "work."]},
	{type: 'paragraph',
	 body: ["By:", "David Karn"]},
	{type: 'paragraph',
	 body: ["Blah", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen"]},
	{type: 'paragraph',
	 body: ["Blah", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen"]}]});



  
