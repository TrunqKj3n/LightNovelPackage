/*
	LightNovelAPI - An unofficial API for https://ln.hako.re/
	version 1.0.0
	Made by Thieu Trung Kien in 2022.
	Copyright (C) 2016-2022 Ln.Hako.re All rights reserved.
*/

/*
-----------------------------------------------------------------
	Modules importing
-----------------------------------------------------------------
*/
const cheerio = require("cheerio"),
	fs = require("fs"),
	request = require("request-promise");

function searchLN(e) {
	return new Promise((async t => {
		request(`https://ln.hako.re/tim-kiem?keywords=${e}`, ((e, r, n) => {
			const i = cheerio.load(n),
				s = [],
				o = i(".series-title").find("a");
			for (let e = 0; e < o.length; e++) {
				const t = i(o[e]).text(),
					r = i(o[e]).attr("href");
				s.push({
					name: t,
					url: `https://ln.hako.re${r}`
				})
			}
			t(s)
		}))
	}))
}

function getChapterLN(e) {
	return new Promise((async t => {
		request(e, ((e, r, n) => {
			if (!e && 200 == r.statusCode) {
				var i = [];
				const e = cheerio.load(n),
					r = [],
					s = e(".container").find(".row").find(".reading-content").find("#chapter-content").find("p").find("img"),
					o = e(".container").find(".row").find(".reading-content").find("#chapter-content").find("p");
				for (let t = 0; t < s.length; t++) {
					const r = e(s[t]).attr("src");
					i.push(r)
				}
				for (let t = 0; t < o.length; t++) {
					const n = e(o[t]).text();
					r.push(n)
				}
				t({
					images: i,
					text: r
				})
			}
		}))
	}))
}

function getObjLN(e) {
	return new Promise((async t => {
		request(`${e}`, ((e, r, n) => {
			var i = [],
				s = [];
			const o = cheerio.load(n),
				a = o(".series-cover").find(".a6-ratio").find(".img-in-ratio").attr("style").replace(/background-image: url/gi, "").replace("('", "").replace("')", ""),
				c = o(".series-name-group").find(".series-name").text().replace(/\n/gi, ""),
				h = o(".at-series").find(".chapter-name").find("a");
			i.push({
				title: c,
				images: a
			});
			for (let e = 0; e < h.length; e++) s.push("https://ln.hako.re" + o(h[e]).attr("href"));
			t({
				data: i,
				url: s
			})
		}))
	}))
}
module.exports.searchLN = searchLN, module.exports.getChapterLN = getChapterLN, module.exports.getObjLN = getObjLN;
