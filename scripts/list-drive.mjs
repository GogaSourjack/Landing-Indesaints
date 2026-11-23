async function list(id) {
  const res = await fetch("https://drive.google.com/embeddedfolderview?id=" + id);
  const html = await res.text();
  const entries = [];
  const re = /id="entry-([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g;
  for (const match of html.matchAll(re)) {
    entries.push({ id: match[1], title: match[2] });
  }
  return entries;
}

const shows = await list("1ZvycjQoXN3dKBJZXbeaeH7W0ezLE7vnj");
const jun = shows.find((item) => item.title.includes("2019-06-28"));
const sub = jun ? await list(jun.id) : [];
const social = sub.find((item) => item.title.includes("Redes"));
const files = social ? await list(social.id) : [];
const niver = await list("1ZabhzadmHZ-m8a-UjeB1RJnJCVxbLjcF");

console.log(JSON.stringify({ jun, sub, files, niver }, null, 2));
