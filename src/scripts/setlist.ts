import gsap from "gsap";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sheet = document.querySelector<HTMLElement>("[data-sheet]");
const lines = [...document.querySelectorAll<HTMLElement>("[data-line]")];

function setOpen(line: HTMLElement, open: boolean) {
  const panel = line.querySelector<HTMLElement>("[data-tear]");
  const button = line.querySelector("button");
  if (!panel || !button) return;

  line.classList.toggle("is-open", open);
  button.setAttribute("aria-expanded", open ? "true" : "false");
  panel.toggleAttribute("inert", !open);
  panel.setAttribute("aria-hidden", open ? "false" : "true");

  if (open) mountPlayer(line, panel);
  if (!open) panel.querySelector("[data-player]")?.replaceChildren();

  if (reduced) {
    gsap.set(panel, { clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" });
    return;
  }

  gsap.fromTo(
    panel,
    { clipPath: open ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" },
    {
      clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      duration: 0.48,
      ease: "power3.out",
    },
  );

  if (open) {
    gsap.fromTo(line, { rotation: -0.6 }, { rotation: 0.4, duration: 0.16, yoyo: true, repeat: 1 });
  }
}

function mountPlayer(line: HTMLElement, panel: HTMLElement) {
  const id = line.dataset.youtube;
  const slot = panel.querySelector<HTMLElement>("[data-player]");
  if (!id || !slot || slot.querySelector("iframe")) return;

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`;
  iframe.title = line.dataset.title ?? "Clipe da IndeSaints";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture";
  iframe.allowFullscreen = true;
  slot.append(iframe);
}

function closeOthers(current: HTMLElement) {
  for (const line of lines) {
    if (line !== current && line.classList.contains("is-open")) setOpen(line, false);
  }
}

function toggleLine(line: HTMLElement) {
  const willOpen = !line.classList.contains("is-open");
  if (willOpen) closeOthers(line);
  setOpen(line, willOpen);
}

for (const line of lines) {
  line.querySelector("button")?.addEventListener("click", () => toggleLine(line));
}

let flipped = false;

function flip(next = !flipped) {
  if (!sheet) return;
  flipped = next;
  sheet.classList.toggle("is-back", flipped);
  const front = sheet.querySelector<HTMLElement>(".front");
  const back = sheet.querySelector<HTMLElement>(".back");
  front?.toggleAttribute("inert", flipped);
  back?.toggleAttribute("inert", !flipped);
  front?.setAttribute("aria-hidden", flipped ? "true" : "false");
  back?.setAttribute("aria-hidden", flipped ? "false" : "true");
  const rotation = flipped ? 180 : 0;
  if (reduced) {
    gsap.set(sheet, { rotateY: rotation });
    return;
  }
  gsap.to(sheet, { rotateY: rotation, duration: 0.72, ease: "power2.inOut" });
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-flip]")) {
  button.addEventListener("click", () => flip());
}

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
  if (typing) return;

  if (event.key === "Escape") {
    const open = lines.find((line) => line.classList.contains("is-open"));
    if (open) {
      setOpen(open, false);
      open.querySelector("button")?.focus();
      return;
    }
    if (flipped) flip(false);
  }

  if (event.key === "v" || event.key === "V") {
    event.preventDefault();
    flip();
  }

  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  event.preventDefault();
  const active = document.activeElement?.closest<HTMLElement>("[data-line]");
  const index = active ? lines.indexOf(active) : -1;
  const direction = event.key === "ArrowDown" ? 1 : -1;
  const next = lines[(index + direction + lines.length) % lines.length];
  next.querySelector("button")?.focus();
});
