import Vue from "vue";
import axios from "axios";

const server = "http://127.0.0.1:6004";
axios.defaults.baseURL = server;

Vue.prototype.$axios = axios;
