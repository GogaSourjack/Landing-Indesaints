import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const files = [
  ["9801", "1xp1-8gmgy_l3ZVUfutXWsZlHS_ctbQxM"],
  ["9837", "1214_0v57l0JuCzQN136LjB7zFLoFazHv"],
  ["9841", "10NXWOFggh_6wkQ_dG_-_LTVtqM8iSO3P"],
  ["9854", "18on5etjqASwiGIivn7TTMwG4nNBp5mw5"],
  ["9855", "16EYWTYuque8m-sLx3HCl4oHKfmHGj3hb"],
  ["9856", "1a4L4etmcHB-1zGPcwazGGHEbJtNGbZ3z"],
  ["9861", "1wX4ZFIPBmaoB8mAovMBuplhHMyHvw22s"],
  ["9878", "1jdrGEN7bo5mC4kHshLOYJkP1Eu3wZzx2"],
  ["9889", "1dQPaU0Jh08LbThfzKgRpfzkodLmvhVJ1"],
  ["9904", "1TF4yNIVGmpfOaGwKodmCIiBs14lAYxGQ"],
  ["n222039", "1m7XMqL0RM5hxVP7IwxDy1aNraxNuxiia"],
  ["n222041", "1t1fOmsJ4PmW7CzOabV-39Hd2ZG9YtNud"],
  ["n222043", "1LPxgKJZQOBVSMPEz37XR0hbL2cv1r072"],
  ["n222131", "15P2h7kgoUoQCRcjA_wngu4GrBjyuvHYr"],
  ["n222137", "1fb-onYRIk2Cm4FQUPWhu-I3ccNcUrHCU"],
  ["n222143", "13tB5BnrBWPrsly2miTseghLwisUkLkaB"],
  ["n222242", "1YQNlcCmA_D6BIlnrNR8Frrh-w0RhLBcw"],
  ["n222250", "1vrZEHjxI0PvjDmsysmBf0qzLbz1cA7Tp"],
  ["n222254", "1QLgNpOv-g2uUtPaEFhkfZw-oPWSWvkZk"],
];

await mkdir("tmp-thumbs", { recursive: true });

for (const [name, id] of files) {
  const url = `https://drive.google.com/thumbnail?id=${id}&sz=w600`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    console.log("FAIL", name, res.status, res.headers.get("content-type"));
    continue;
  }
  const type = res.headers.get("content-type") || "";
  const ext = type.includes("png") ? "png" : "jpg";
  const path = `tmp-thumbs/${name}.${ext}`;
  await pipeline(res.body, createWriteStream(path));
  console.log("OK", path, type);
}
