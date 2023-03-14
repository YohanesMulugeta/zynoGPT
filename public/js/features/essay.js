import Feature from "./feature.js";

const essayWriting = new Feature(
  `write a essay,based on my topic is <INPUT1>, the description is <TEXTAREA1>,if it has heading return it with ## Header,list them if it has use any formatting such as *,** if necessory`,
  "essay-writing",
  "output"
);

export default essayWriting;
