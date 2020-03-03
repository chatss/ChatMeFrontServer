export function someAction (/* context */) {
    try {
        res = await this._vm.$axios.post({"query":"query {\n  servers{\n    id, name, namespace\n  }\n}"});
    }   catch (err) {
        console.error(err);
    }
    return res
}

