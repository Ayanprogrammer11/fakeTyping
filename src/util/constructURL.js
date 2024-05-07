import { HOST } from "../constants";

export const constructURL = function (channelId) {
  return `${HOST}/${channelId}/typing`;
};
