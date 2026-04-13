const graphs = {
	2: {
		ыа: "ꭠ",
		иэ: "ꭡ",
		уо: "ꭣ",
		үө: "w",
		нь: "ɲ",
		дь: "з",
		ль: "ʎ",
		аа: "a:",
		оо: "ɔ:",
		уу: "u:",
		ыы: "ɯ:",
		ээ: "e:",
		өө: "ꭢ:",
		үү: "y:",
		ии: "i:",
		мм: "m:",
		нн: "n:",
		ҥҥ: "ŋ:",
		пп: "p:",
		тт: "t:",
		чч: "c:",
		кк: "k:",
		бб: "b:",
		дд: "d:",
		гг: "g:",
		сс: "s:",
		хх: "q:",
		һһ: "h:",
		ҕҕ: "ʃ:",
		лл: "l:",
		йй: "j:",
		рр: "r:",
		вв: "v:",
		фф: "f:",
	},
	1: {
		а: "a",
		б: "b",
		г: "g",
		ҕ: "ʃ",
		д: "d",
		и: "i",
		й: "j",
		ҋ: "ɟ",
		к: "k",
		л: "l",
		м: "m",
		н: "n",
		ҥ: "ŋ",
		ң: "ŋ",
		о: "ɔ",
		ө: "ꭢ",
		п: "p",
		р: "r",
		с: "s",
		һ: "h",
		т: "t",
		у: "u",
		ү: "y",
		х: "q",
		ч: "c",
		ы: "ɯ",
		э: "e",
		в: "v",
		ж: "ʒ",
		з: "z",
		ф: "f",
		ц: "ʦ",
		ш: "ʃ",
		щ: "ɕɕ",
		е: "e",
		ё: "jo",
		ю: "ju",
		я: "ja",
		ъ: "",
		ь: "",
	},
};

const diphthongs = [
	{ cyr: "ыа", novg: "ɯa" },
	{ cyr: "иэ", novg: "ie" },
	{ cyr: "уо", novg: "uɔ" },
	{ cyr: "үө", novg: "yꭢ" },
];

const yakutLetters = [
	{ cyr: "һ", novg: "h" },
	{ cyr: "ө", novg: "ꭢ" },
	{ cyr: "ҕ", novg: "ʃ" },
	{ cyr: "ү", novg: "y" },
	{ cyr: "ҥ", novg: "ŋ" },
];

const specialGraphs = [
	{ cyr: "дь", novg: "з" },
	{ cyr: "нь", novg: "ɲ" },
	{ cyr: "ль", novg: "ʎ" },
	{ cyr: "ҋ", novg: "ɟ" },
];

function transliterate(text) {
	text = text.toLowerCase();
	let result = [];
	let i = 0;

	while (i < text.length) {
		let matched = false;

		for (let len = 2; len >= 1; len--) {
			const sub = text.substring(i, i + len);
			if (graphs[len] && graphs[len][sub] !== undefined) {
				result.push({ graph: sub, value: graphs[len][sub], len: len });
				i += len;
				matched = true;
				break;
			}
		}

		if (!matched) {
			result.push({ graph: text[i], value: text[i], len: 0 });
			i += 1;
		}
	}

	return result;
}

function insertAtCursor(text) {
	const el = document.getElementById("input");
	const start = el.selectionStart;
	const end = el.selectionEnd;
	const before = el.value.substring(0, start);
	const after = el.value.substring(end);
	el.value = before + text + after;
	el.selectionStart = el.selectionEnd = start + text.length;
	el.focus();
	onInput();
}

function renderOutput(tokens) {
	return tokens
		.map((t) => {
			if (t.len === 0) return escapeHtml(t.value);
			const cls = t.len === 2 ? "digraph" : "single";
			return `<span class="graph ${cls}" title="${escapeHtml(t.graph)} → ${escapeHtml(t.value)}">${escapeHtml(t.value)}</span>`;
		})
		.join("");
}

function renderPlainText(tokens) {
	return tokens.map((t) => t.value).join("");
}

function escapeHtml(s) {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function buildSidebar() {
	let html = "";

	html += buildLettersSection();

	const sections = [
		{
			title: "Гласные",
			items: filterGraphs(["а", "о", "у", "ы", "э", "ө", "ү", "и"]),
		},
		{
			title: "Согласные",
			items: filterGraphs([
				"б",
				"г",
				"ҕ",
				"д",
				"й",
				"ҋ",
				"к",
				"л",
				"м",
				"н",
				"ҥ",
				"п",
				"р",
				"с",
				"һ",
				"т",
				"х",
				"ч",
			]),
		},
	];

	for (const s of sections) {
		const rows = s.items
			.map(([k, v]) => {
				return `<tr><td class="cyr clickable" onclick="insertAtCursor('${k}')">${escapeHtml(k)}</td><td class="novg">${escapeHtml(v) || "∅"}</td></tr>`;
			})
			.join("");
		html += `<div class="table-section"><h3>${s.title}</h3><table><tbody>${rows}</tbody></table></div>`;
	}

	return html;
}

function buildLettersSection() {
	let html = "";

	html += `<div class="table-section letters-section"><h3>дифтонги</h3>`;
	html += `<div class="alphabet-grid">`;
	for (const d of diphthongs) {
		html += `<span class="letter special clickable" onclick="insertAtCursor('${d.cyr}')" title="${d.cyr} → ${d.novg}">${d.cyr}</span>`;
	}
	html += `</div></div>`;

	html += `<div class="table-section letters-section"><h3>Саха буукубалара</h3>`;
	html += `<div class="alphabet-grid">`;
	for (const l of yakutLetters) {
		html += `<span class="letter special clickable" onclick="insertAtCursor('${l.cyr}')" title="${l.cyr} → ${l.novg}">${l.cyr}</span>`;
	}
	html += `</div></div>`;

	html += `<div class="alphabet-grid letters-section">`;
	for (const g of specialGraphs) {
		html += `<span class="letter special clickable" onclick="insertAtCursor('${g.cyr}')" title="${g.cyr} → ${g.novg}">${g.cyr}</span>`;
	}
	html += `</div>`;

	return html;
}

function filterGraphs(keys) {
	return keys
		.filter((k) => graphs[1][k] !== undefined)
		.map((k) => [k, graphs[1][k]]);
}

let copyTimeout = null;

function onInput() {
	const text = document.getElementById("input").value;
	const tokens = transliterate(text);
	document.getElementById("output").innerHTML = renderOutput(tokens);
	document.getElementById("output-plain").value = renderPlainText(tokens);
	document.getElementById("char-count").textContent = text.replace(
		/\s/g,
		"",
	).length;
}

function onCopy() {
	const text = document.getElementById("output-plain").value;
	navigator.clipboard.writeText(text).then(() => {
		const btn = document.getElementById("copy-btn");
		btn.textContent = "Скопировано";
		if (copyTimeout) clearTimeout(copyTimeout);
		copyTimeout = setTimeout(() => {
			btn.textContent = "Копировать";
		}, 1500);
	});
}

function onClear() {
	document.getElementById("input").value = "";
	document.getElementById("output").innerHTML = "";
	document.getElementById("output-plain").value = "";
	document.getElementById("char-count").textContent = "0";
}

function onPaste() {
	navigator.clipboard.readText().then((s) => {
		document.getElementById("input").value = s;
		onInput();
	});
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("graph-table").innerHTML = buildSidebar();
	document.getElementById("mobile-letters").innerHTML = buildLettersSection();
	document.getElementById("input").addEventListener("input", onInput);
});
