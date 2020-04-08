import { getInfo } from "./store/index";
import { data } from "./store/data";

data.forEach((d) => {
  const info = getInfo(d);
  console.log(`${info.name}: ${info.code}`);
});
