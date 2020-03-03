import axios from "axios";
export async function actServers(context) {
  try {
    const res = await axios.post("/", {
      query: "query {\n  servers{\n    id, name, namespace\n  }\n}"
    });
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
}
