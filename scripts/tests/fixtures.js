const _ = require("lodash");

const xmlSpacePreserveTag = {type: "tag", position: "start", value: '<w:t xml:space="preserve">', text: true};

const fixtures = {
	simple: {
		it: "should handle {user} with tag",
		content: "<w:t>Hi {user}</w:t>",
		scope: {
			user: "Foo",
		},
		result: '<w:t xml:space="preserve">Hi Foo</w:t>',
		lexed: [
			{type: "tag", position: "start", value: "<w:t>", text: true},
			{type: "content", value: "Hi ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "user", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		parsed: [
			{type: "tag", position: "start", value: "<w:t>", text: true},
			{type: "content", value: "Hi ", position: "insidetag"},
			{type: "placeholder", value: "user"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		postparsed: [
			{type: "tag", position: "start", value: '<w:t xml:space="preserve">', text: true},
			{type: "content", value: "Hi ", position: "insidetag"},
			{type: "placeholder", value: "user"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
	},
	dot: {
		it: "should handle {.} with tag",
		content: "<w:t>Hi {.}</w:t>",
		scope: "Foo",
		result: '<w:t xml:space="preserve">Hi Foo</w:t>',
		lexed: [
			{type: "tag", position: "start", value: "<w:t>", text: true},
			{type: "content", value: "Hi ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: ".", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		parsed: [
			{type: "tag", position: "start", value: "<w:t>", text: true},
			{type: "content", value: "Hi ", position: "insidetag"},
			{type: "placeholder", value: "."},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		postparsed: [
			{type: "tag", position: "start", value: '<w:t xml:space="preserve">', text: true},
			{type: "content", value: "Hi ", position: "insidetag"},
			{type: "placeholder", value: "."},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
	},
	strangetags: {
		it: "should xmlparse strange tags",
		content: "<w:t>{name} {</w:t>FOO<w:t>age</w:t>BAR<w:t>}</w:t>",
		scope: {
			name: "Foo",
			age: 12,
		},
		result: '<w:t xml:space="preserve">Foo 12</w:t>FOO<w:t></w:t>BAR<w:t></w:t>',
		parsed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "placeholder", value: "name"},
			{type: "content", value: " ", position: "insidetag"},
			{type: "placeholder", value: "age"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "content", value: "FOO", position: "outsidetag"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "content", value: "BAR", position: "outsidetag"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		xmllexed: [
			{type: "tag", position: "start", value: "<w:t>", text: true},
			{type: "content", value: "{name} {"},
			{type: "tag", position: "end", value: "</w:t>", text: true},
			{type: "content", value: "FOO"},
			{type: "tag", position: "start", value: "<w:t>", text: true},
			{type: "content", value: "age"},
			{type: "tag", position: "end", value: "</w:t>", text: true},
			{type: "content", value: "BAR"},
			{type: "tag", position: "start", value: "<w:t>", text: true},
			{type: "content", value: "}"},
			{type: "tag", position: "end", value: "</w:t>", text: true},
		],
		lexed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "name", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "content", value: " ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "content", value: "FOO", position: "outsidetag"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "age", position: "insidetag"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "content", value: "BAR", position: "outsidetag"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
	},
	otherdelimiters: {
		it: "should work with custom delimiters",
		content: "<w:t>Hello [[[name]]</w:t>",
		scope: {
			name: "John Doe",
		},
		result: '<w:t xml:space="preserve">Hello John Doe</w:t>',
		delimiters: {
			start: "[[[",
			end: "]]",
		},
		lexed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "name", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		parsed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "placeholder", value: "name"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
	},
	otherdelimiterssplitted: {
		it: "should work with custom delimiters splitted",
		content: '<w:t>Hello {name}</w:t><w:t foo="bar">}, how is it ?</w:t>',
		scope: {
			name: "John Doe",
		},
		result: '<w:t xml:space="preserve">Hello John Doe</w:t><w:t foo="bar">, how is it ?</w:t>',
		delimiters: {
			start: "{",
			end: "}}",
		},
		lexed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "name", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: '<w:t foo="bar">', text: true, position: "start"},
			{type: "content", value: ", how is it ?", position: "insidetag"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		parsed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "placeholder", value: "name"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: '<w:t foo="bar">', text: true, position: "start"},
			{type: "content", value: ", how is it ?", position: "insidetag"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
	},
	otherdelimiterssplittedover2tags: {
		it: "should work with custom delimiters splitted over > 2 tags",
		content: "<w:t>Hello {name}</w:t><w:t>}</w:t>TAG<w:t>}</w:t><w:t>}}foobar</w:t>",
		scope: {
			name: "John Doe",
		},
		result: '<w:t xml:space="preserve">Hello John Doe</w:t><w:t></w:t>TAG<w:t></w:t><w:t>foobar</w:t>',
		delimiters: {
			start: "{",
			end: "}}}}}",
		},
		lexed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "name", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "content", value: "TAG", position: "outsidetag"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "foobar", position: "insidetag"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		parsed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "placeholder", value: "name"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "content", value: "TAG", position: "outsidetag"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "foobar", position: "insidetag"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
	},
	looptag: {
		it: "should work with loops",
		content: "<w:t>Hello {#users}{name}, {/users}</w:t>",
		scope: {
			users: [
				{name: "John Doe"},
				{name: "Jane Doe"},
				{name: "Wane Doe"},
			],
		},
		result: '<w:t xml:space="preserve">Hello John Doe, Jane Doe, Wane Doe, </w:t>',
		lexed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "#users", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "name", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "content", value: ", ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "/users", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		parsed: [
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "placeholder", value: "users", location: "start", module: "loop", inverted: false, expandTo: "auto"},
			{type: "placeholder", value: "name"},
			{type: "content", value: ", ", position: "insidetag"},
			{type: "placeholder", value: "users", location: "end", module: "loop"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
		postparsed: [
			xmlSpacePreserveTag,
			{type: "content", value: "Hello ", position: "insidetag"},
			{
				type: "placeholder", value: "users", module: "loop", inverted: false, subparsed: [
					{type: "placeholder", value: "name"},
					{type: "content", value: ", ", position: "insidetag"},
				],
			},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
		],
	},
	dashlooptag: {
		it: "should work with dashloops",
		content: "<w:p><w:t>Hello {-w:p users}{name}, {/users}</w:t></w:p>",
		scope: {
			users: [
				{name: "John Doe"},
				{name: "Jane Doe"},
				{name: "Wane Doe"},
			],
		},
		result: '<w:p><w:t xml:space="preserve">Hello John Doe, </w:t></w:p><w:p><w:t xml:space="preserve">Hello Jane Doe, </w:t></w:p><w:p><w:t xml:space="preserve">Hello Wane Doe, </w:t></w:p>',
		lexed: [
			{type: "tag", value: "<w:p>", text: false, position: "start"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "-w:p users", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "name", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "content", value: ", ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "/users", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: "</w:p>", text: false, position: "end"},
		],
		parsed: [
			{type: "tag", value: "<w:p>", text: false, position: "start"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "content", value: "Hello ", position: "insidetag"},
			{type: "placeholder", value: "users", location: "start", module: "loop", inverted: false, expandTo: "w:p"},
			{type: "placeholder", value: "name"},
			{type: "content", value: ", ", position: "insidetag"},
			{type: "placeholder", value: "users", location: "end", module: "loop"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: "</w:p>", text: false, position: "end"},
		],
		postparsed: [
			{
				type: "placeholder", value: "users", module: "loop", inverted: false, subparsed: [
					{type: "tag", value: "<w:p>", text: false, position: "start"},
					xmlSpacePreserveTag,
					{type: "content", value: "Hello ", position: "insidetag"},
					{type: "placeholder", value: "name"},
					{type: "content", value: ", ", position: "insidetag"},
					{type: "tag", value: "</w:t>", text: true, position: "end"},
					{type: "tag", value: "</w:p>", text: false, position: "end"},
				],
			},
		],
	},
	dashloopnested: {
		it: "should work with dashloops nested",
		content: "<w:tr><w:p><w:t>{-w:tr columns} Hello {-w:p users}{name}, {/users}</w:t><w:t>{/columns}</w:t></w:p></w:tr>",
		scope: {
			columns: [
				{
					users: [
						{name: "John Doe"},
						{name: "Jane Doe"},
						{name: "Wane Doe"},
					],
				},
			],
		},
		result: '<w:tr><w:p><w:t xml:space="preserve"> Hello John Doe, </w:t><w:t></w:t></w:p><w:p><w:t xml:space="preserve"> Hello Jane Doe, </w:t><w:t></w:t></w:p><w:p><w:t xml:space="preserve"> Hello Wane Doe, </w:t><w:t></w:t></w:p></w:tr>',
		lexed: [
			{type: "tag", position: "start", text: false, value: "<w:tr>"},
			{type: "tag", position: "start", text: false, value: "<w:p>"},
			{type: "tag", position: "start", text: true, value: "<w:t>"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "-w:tr columns", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "content", value: " Hello ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "-w:p users", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "name", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "content", value: ", ", position: "insidetag"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "/users", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", position: "end", text: true, value: "</w:t>"},
			{type: "tag", position: "start", text: true, value: "<w:t>"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "/columns", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", position: "end", text: true, value: "</w:t>"},
			{type: "tag", position: "end", text: false, value: "</w:p>"},
			{type: "tag", position: "end", text: false, value: "</w:tr>"},
		],
		parsed: [
			{type: "tag", position: "start", text: false, value: "<w:tr>"},
			{type: "tag", position: "start", text: false, value: "<w:p>"},
			{type: "tag", position: "start", text: true, value: "<w:t>"},
			{type: "placeholder", value: "columns", location: "start", module: "loop", inverted: false, expandTo: "w:tr"},
			{type: "content", value: " Hello ", position: "insidetag"},
			{type: "placeholder", value: "users", location: "start", module: "loop", inverted: false, expandTo: "w:p"},
			{type: "placeholder", value: "name"},
			{type: "content", value: ", ", position: "insidetag"},
			{type: "placeholder", value: "users", location: "end", module: "loop"},
			{type: "tag", position: "end", text: true, value: "</w:t>"},
			{type: "tag", position: "start", text: true, value: "<w:t>"},
			{type: "placeholder", value: "columns", location: "end", module: "loop"},
			{type: "tag", position: "end", text: true, value: "</w:t>"},
			{type: "tag", position: "end", text: false, value: "</w:p>"},
			{type: "tag", position: "end", text: false, value: "</w:tr>"},
		],
		postparsed: [
			{
				type: "placeholder", value: "columns", module: "loop", inverted: false, subparsed: [
					{type: "tag", value: "<w:tr>", text: false, position: "start"},
					{
						type: "placeholder", value: "users", module: "loop", inverted: false, subparsed: [
							{type: "tag", value: "<w:p>", text: false, position: "start"},
							xmlSpacePreserveTag,
							{type: "content", value: " Hello ", position: "insidetag"},
							{type: "placeholder", value: "name"},
							{type: "content", value: ", ", position: "insidetag"},
							{type: "tag", value: "</w:t>", text: true, position: "end"},
							{type: "tag", value: "<w:t>", text: true, position: "start"},
							{type: "tag", value: "</w:t>", text: true, position: "end"},
							{type: "tag", value: "</w:p>", text: false, position: "end"},
						],
					},
					{type: "tag", value: "</w:tr>", text: false, position: "end"},
				],
			},
		],
	},
	rawxml: {
		it: "should work with rawxml",
		content: "BEFORE<w:p><w:t>{@rawxml}</w:t></w:p>AFTER",
		scope: {
			rawxml: '<w:p><w:pPr><w:rPr><w:color w:val="FF0000"/></w:rPr></w:pPr><w:r><w:rPr><w:color w:val="FF0000"/></w:rPr><w:t>My custom</w:t></w:r><w:r><w:rPr><w:color w:val="00FF00"/></w:rPr><w:t>XML</w:t></w:r></w:p>',
		},
		result: 'BEFORE<w:p><w:pPr><w:rPr><w:color w:val="FF0000"/></w:rPr></w:pPr><w:r><w:rPr><w:color w:val="FF0000"/></w:rPr><w:t>My custom</w:t></w:r><w:r><w:rPr><w:color w:val="00FF00"/></w:rPr><w:t>XML</w:t></w:r></w:p>AFTER',
		lexed: [
			{type: "content", value: "BEFORE", position: "outsidetag"},
			{type: "tag", value: "<w:p>", text: false, position: "start"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "delimiter", position: "start"},
			{type: "content", value: "@rawxml", position: "insidetag"},
			{type: "delimiter", position: "end"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: "</w:p>", text: false, position: "end"},
			{type: "content", value: "AFTER", position: "outsidetag"},
		],
		parsed: [
			{type: "content", value: "BEFORE", position: "outsidetag"},
			{type: "tag", value: "<w:p>", text: false, position: "start"},
			{type: "tag", value: "<w:t>", text: true, position: "start"},
			{type: "placeholder", value: "rawxml", module: "rawxml"},
			{type: "tag", value: "</w:t>", text: true, position: "end"},
			{type: "tag", value: "</w:p>", text: false, position: "end"},
			{type: "content", value: "AFTER", position: "outsidetag"},
		],
		postparsed: [
			{type: "content", value: "BEFORE", position: "outsidetag"},
			{type: "placeholder", value: "rawxml", module: "rawxml", expanded: [
				[
					{type: "tag", value: "<w:p>", text: false, position: "start"},
					{type: "tag", value: "<w:t>", text: true, position: "start"},
				],
				[
					{type: "tag", value: "</w:t>", text: true, position: "end"},
					{type: "tag", value: "</w:p>", text: false, position: "end"},
				],
			]},
			{type: "content", value: "AFTER", position: "outsidetag"},
		],
	},
};

fixtures.rawxmlemptycontent = _.clone(fixtures.rawxml);
fixtures.rawxmlemptycontent.it = "should work with rawxml with undefined tags";
fixtures.rawxmlemptycontent.scope = {};
fixtures.rawxmlemptycontent.result = "BEFOREAFTER";

Object.keys(fixtures).forEach(function (key) {
	const fixture = fixtures[key];
	fixture.delimiters = fixture.delimiters || {
		start: "{",
		end: "}",
	};
});

module.exports = fixtures;
