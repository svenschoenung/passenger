import Vue from 'vue';
import { timestampToIsoDate } from "@/util/date";

Vue.filter('timestamp-to-iso-date', timestampToIsoDate)