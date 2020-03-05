import Vue from "vue";
import axios from "axios";

const server = "http://34.97.145.153:6004";
axios.defaults.baseURL = server;

Vue.prototype.$axios = axios;
