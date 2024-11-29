import "svelte/internal/disclose-version";
import * as $ from "svelte/internal/client";

const increment = (_, count) => {
	$.set(count, $.get(count) + 1);
};

var root_1 = $.template(`<meta name="github:site" content="@t-lock"> <meta name="github:creator" content="@t-lock">`, 1);
var root = $.template(`<button class="fancy svelte-hkfi0m"> </button>`);

const $$css = {
	hash: "svelte-hkfi0m",
	code: ".fancy.svelte-hkfi0m {color:pink;background-color:rebeccapurple;}"
};

export default function _unknown_($$anchor, $$props) {
	$.append_styles($$anchor, $$css);

	let initialCount = $.prop($$props, "initialCount", 3, 42);
	let count = $.state($.proxy(initialCount()));
	var button = root();

	$.event("resize", $.window, (e) => {
		console.log(e);
	});

	$.head(($$anchor) => {
		var fragment = root_1();

		$.next(2);
		$.append($$anchor, fragment);
	});

	button.__click = [increment, count];

	var text = $.child(button);

	$.reset(button);
	$.template_effect(() => $.set_text(text, `count is ${$.get(count) ?? ""}`));
	$.append($$anchor, button);
}

$.delegate(["click"]);