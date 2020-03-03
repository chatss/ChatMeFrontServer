import axios from "axios";
export async function actlogin({ dispatch, commit }, context) {
  try {
    const res = await axios.post(`/`, {
      query: `mutation {\n  login(\n    id: \"${context.id}\",\n    password:\"${context.password}\"\n  )\n}`
    });
    commit("setUserinfo", context.id);

    return res.data.data.login;
  } catch (err) {
    console.error(err);
  }
}
